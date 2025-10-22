import React, { useCallback, useState } from 'react';
import InfiniteScrollList from '../../components/common/InfiniteScrollList';
import { deleteMyPuzzle, getUserPuzzles } from '../../apis/user';
import CommunityCard from '../../components/features/CommunityCard';
import { CommunityPuzzle } from '../../types';
import { Container } from './index.styles';
import { CustomModal } from '../../components/common';
import useModal from '../../hooks/useModal';
import { ParamListBase, useFocusEffect, useNavigation } from '@react-navigation/native';
import { showBottomToast } from '../../components/common/Toast/toastMessage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const MyPuzzles = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const {
    isModalVisible,
    activateModal,
    closePrimarily,
    closeSecondarily,
    category: modalCategory,
  } = useModal();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDelete = async (id: number) => {
    activateModal('DELETE_PUZZLE_CONFIRM', {
      primaryAction: async () => {
        try {
          await deleteMyPuzzle(id);
          setRefreshKey((prev) => prev + 1);
          showBottomToast('success', '퍼즐이 삭제되었습니다.');
        } catch (error) {
          showBottomToast('error', error as string);
        }
      },
    });
  };

  useFocusEffect(
    useCallback(() => {
      // list refresh
      setRefreshKey((prev) => prev + 1);
    }, []),
  );

  return (
    <Container>
      <InfiniteScrollList<CommunityPuzzle>
        key={refreshKey}
        apiCall={getUserPuzzles}
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
            onPress={() => navigation.navigate('CommunityPuzzleSolve', { puzzle: item })}
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
