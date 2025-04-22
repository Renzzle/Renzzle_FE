/* eslint-disable react-hooks/exhaustive-deps */
import { ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { RootStackParamList } from '../../../components/types';
import GameStatusIndicator, {
  IndicatorCategoryType,
} from '../../../components/features/GameStatusIndicator';
import { IndicatorContainer, SolveContainer } from './index.styles';
import CustomModal from '../../../components/common/CustomModal';
import PuzzleHeader from '../../../components/features/PuzzleHeader';
import Board from '../../../components/features/Board';
import useModal from '../../../hooks/useModal';
import { updateLessonSolve } from '../../../apis/lesson';
import useAuthStore from '../../../store/useAuthStore';

const LessonPuzzleSolve = () => {
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
  const [category, setCategory] = useState<IndicatorCategoryType>();
  const { refreshToken } = useAuthStore();

  useEffect(() => {
    if (isWin) {
      activateModal('TRAINING_PUZZLE_SUCCESS', {
        primaryAction: async () => {
          if (refreshToken !== undefined) {
            await updateLessonSolve(refreshToken, id);
          }
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
    isLoading ? setCategory('AI_MOVE_IN_PROGRESS') : setCategory(undefined);
  }, [isLoading]);

  return (
    <SolveContainer>
      <CustomModal
        isVisible={isModalVisible}
        category={modalCategory}
        onPrimaryAction={closePrimarily}
        onSecondaryAction={closeSecondarily}
      />

      <PuzzleHeader title={title} info={description} author={author} puzzleNum={`${id}`} />

      <IndicatorContainer>
        <GameStatusIndicator category={category} />
      </IndicatorContainer>

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

export default LessonPuzzleSolve;
