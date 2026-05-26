import React, { useMemo } from 'react';
import { Container } from './index.styles';
import InfiniteScrollList, { ApiCallParams } from '../../components/common/InfiniteScrollList';
import { CommunityPuzzle } from '../../types';
import { getLikedPuzzles } from '../../apis/user';
import CommunityCard from '../../components/features/CommunityCard';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useOptimisticCommunityUpdate from '../../hooks/useOptimisticCommunityUpdate';

const LikedPuzzles = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const listRef = useOptimisticCommunityUpdate();

  const apiParams = useMemo<Partial<ApiCallParams>>(() => ({}), []);

  const navigateToCommunityDetail = (puzzle: CommunityPuzzle) => {
    navigation.navigate('CommunityPuzzleSolve', {
      puzzle: puzzle,
      fromScreen: 'LikedPuzzles',
    });
  };

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
