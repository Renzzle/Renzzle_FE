import React, { useEffect, useMemo, useRef } from 'react';
import InfiniteScrollList, {
  ApiCallParams,
  InfiniteScrollListRef,
} from '../../components/common/InfiniteScrollList';
import { deleteMyPuzzle, getUserPuzzles } from '../../apis/user';
import CommunityCard from '../../components/features/CommunityCard';
import { CommunityPuzzle, RootStackParamList } from '../../types';
import { Container } from './index.styles';
import { CustomModal } from '../../components/common';
import useModal from '../../hooks/useModal';
import { ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { showBottomToast } from '../../components/common/Toast/toastMessage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const MyPuzzles = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<RootStackParamList, 'CommunityPuzzles'>>();
  const listRef = useRef<InfiniteScrollListRef<CommunityPuzzle>>(null);
  const apiParams = useMemo<Partial<ApiCallParams>>(() => ({}), []);
  const {
    isModalVisible,
    activateModal,
    closePrimarily,
    closeSecondarily,
    category: modalCategory,
  } = useModal();

  const navigateToCommunityDetail = (puzzle: CommunityPuzzle) => {
    navigation.navigate('CommunityPuzzleSolve', {
      puzzle: puzzle,
      fromScreen: 'Mypuzzles',
    });
  };

  const handleDelete = async (id: number) => {
    activateModal('DELETE_PUZZLE_CONFIRM', {
      primaryAction: async () => {
        try {
          await deleteMyPuzzle(id);
          listRef.current?.removeItem(id);

          showBottomToast('success', '퍼즐이 삭제되었습니다.');
        } catch (error) {
          showBottomToast('error', error as string);
        }
      },
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
        apiCall={getUserPuzzles}
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
            onDelete={() => handleDelete(item.id)}
          />
        )}
        keyExtractor={(item) => item && item.id.toString()}
      />

      <CustomModal
        isVisible={isModalVisible}
        category={modalCategory}
        onPrimaryAction={closePrimarily}
        onSecondaryAction={closeSecondarily}
        gameOutcome={{ price: 100 }}
      />
    </Container>
  );
};

export default MyPuzzles;
