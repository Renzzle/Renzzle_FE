/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { RootStackParamList } from '../../../components/types';
import { SolveContainer } from './index.styles';
import PuzzleHeader from '../../../components/features/PuzzleHeader';
import Board from '../../../components/features/Board';
import useModal from '../../../hooks/useModal';
import CustomModal from '../../../components/common/CustomModal';
import { ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { updateLike } from '../../../apis/user';
import useAuthStore from '../../../store/useAuthStore';

const CommunityPuzzleSolve = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<RootStackParamList, 'CommunityPuzzleSolve'>>();
  const { id, boardStatus, title, author, description, depth } = route.params;
  const [isWin, setIsWin] = useState<boolean | null>(null);
  const {
    isModalVisible,
    activateModal,
    closePrimarily,
    closeSecondarily,
    category: modalCategory,
  } = useModal();
  const [isLoading, setIsLoading] = useState<boolean | null>(null);

  const [like, setLike] = useState(null);
  const { accessToken } = useAuthStore();

  const handleLikePress = async () => {
    if (like === null) {
      return;
    }
    if (accessToken !== undefined) {
      const isLiked = await updateLike(accessToken, id);
      setLike(isLiked);
    }
  };

  const checkIfLiked = async () => {
    if (accessToken !== undefined) {
      // TODO: like 확인 api가 없어서 임의로 구현함. 수정필요
      await updateLike(accessToken, id);
      const isLiked = await updateLike(accessToken, id);
      setLike(isLiked);
    }
  };

  useEffect(() => {
    checkIfLiked();
  }, []);

  useEffect(() => {
    if (isWin) {
      activateModal('COMMUNITY_PUZZLE_SUCCESS', {
        primaryAction: () => {
          navigation.goBack();
        },
      });
    }
    if (isWin === false) {
      activateModal('PUZZLE_FAILURE', {
        primaryAction: () => {
          navigation.goBack();
        },
      });
    }
  }, [isWin]);

  useEffect(() => {
    console.log('isLoading!!!:', isLoading);
    // TODO: loading UI
  }, [isLoading]);

  return (
    <SolveContainer>
      <CustomModal
        isVisible={isModalVisible}
        category={modalCategory}
        onPrimaryAction={closePrimarily}
        onSecondaryAction={closeSecondarily}
      />

      <PuzzleHeader
        title={title}
        info={description}
        author={author}
        puzzleNum={`${id}`}
        isLiked={like}
        handleLikePress={handleLikePress}
      />

      <Board
        mode="solve"
        sequence={boardStatus}
        setSequence={() => {}}
        setIsWin={setIsWin}
        setIsLoading={setIsLoading}
        winDepth={depth}
      />
    </SolveContainer>
  );
};

export default CommunityPuzzleSolve;
