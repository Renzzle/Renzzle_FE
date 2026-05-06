import React, { useMemo } from 'react';
import InfiniteScrollList, { ApiCallParams } from '../../components/common/InfiniteScrollList';
import { deleteMyPuzzle, getUserPuzzles } from '../../apis/user';
import CommunityCard from '../../components/features/CommunityCard';
import { CommunityPuzzle } from '../../types';
import { Container } from './index.styles';
import { CustomModal } from '../../components/common';
import useModal from '../../hooks/useModal';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { showBottomToast } from '../../components/common/Toast/toastMessage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useOptimisticCommunityUpdate from '../../hooks/useOptimisticCommunityUpdate';
import { useTranslation } from 'react-i18next';

const MyPuzzles = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const listRef = useOptimisticCommunityUpdate();
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
      fromScreen: 'MyPuzzles',
    });
  };

  const handleDelete = async (id: number) => {
    activateModal('DELETE_PUZZLE_CONFIRM', {
      primaryAction: async () => {
        try {
          await deleteMyPuzzle(id);
          listRef.current?.removeItem(id);

          showBottomToast('success', t('toast.puzzleDeleted'));
        } catch (error) {
          showBottomToast('error', error as string);
        }
      },
    });
  };

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
