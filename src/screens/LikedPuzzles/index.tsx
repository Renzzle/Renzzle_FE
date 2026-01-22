import React, { useEffect, useMemo, useRef } from 'react';
import { Container } from './index.styles';
import InfiniteScrollList, {
  ApiCallParams,
  InfiniteScrollListRef,
} from '../../components/common/InfiniteScrollList';
import { CommunityPuzzle, RootStackParamList } from '../../types';
import { getLikedPuzzles } from '../../apis/user';
import CommunityCard from '../../components/features/CommunityCard';
import { ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const LikedPuzzles = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<RootStackParamList, 'CommunityPuzzles'>>();
  const listRef = useRef<InfiniteScrollListRef<CommunityPuzzle>>(null);

  const apiParams = useMemo<Partial<ApiCallParams>>(() => ({}), []);

  const navigateToCommunityDetail = (puzzle: CommunityPuzzle) => {
    navigation.navigate('CommunityPuzzleSolve', {
      puzzle: puzzle,
      fromScreen: 'LikedPuzzles',
    });
  };

  // Optimistic update
  useEffect(() => {
    if (route.params?.updatedItem) {
      const { id, likeCount, views, isSolved } = route.params.updatedItem;

      listRef.current?.updateItem(id, (prevItem) => ({
        ...prevItem,
        likeCount: likeCount,
        views: views,
        isSolved: isSolved,
      }));

      navigation.setParams({ updatedItem: null });
    }
  }, [route.params?.updatedItem, navigation]);

  return (
    <Container>
      <InfiniteScrollList<CommunityPuzzle>
        ref={listRef}
        apiCall={({ id, size }) => getLikedPuzzles(id, size)}
        defaultParams={apiParams}
        renderItem={({ item }) => (
          <CommunityCard
            title={item.authorName}
            sequence={item.boardStatus}
            depth={item.depth}
            winColor={item.winColor}
            isVerified={item.isVerified}
            date={item.createdAt}
            puzzleId={item.id}
            views={item.views}
            solvedCount={item.solvedCount}
            likeCount={item.likeCount}
            isSolved={item.isSolved}
            onPress={() => navigateToCommunityDetail(item)}
          />
        )}
        keyExtractor={(item) => item && item.id.toString()}
      />
    </Container>
  );
};

export default LikedPuzzles;
