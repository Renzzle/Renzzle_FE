/* eslint-disable react-hooks/exhaustive-deps */
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { CommunityPuzzleSolveProps } from '../../../components/features/ParamList/index.types';
import GameStatusIndicator, { IndicatorCategoryType } from '../../../components/features/GameStatusIndicator';
import { IndicatorContainer, SolveContainer } from './index.styles';
import CustomModal from '../../../components/common/CustomModal';
import PuzzleHeader from '../../../components/features/PuzzleHeader';
import Board from '../../../components/features/Board';
import useModal from '../../../hooks/useModal';

const LessonPuzzleSolve = ({ route }: CommunityPuzzleSolveProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const { id, boardStatus, title, author, description, depth } = route.params;
  const [isWin, setIsWin] = useState<boolean | null>(null);
  const { isModalVisible, activateModal, closePrimarily, closeSecondarily, category: modalCategory } = useModal();
  const [isLoading, setIsLoading] = useState<boolean | null>(null);
  const [category, setCategory] = useState<IndicatorCategoryType>();

  useEffect(() => {
    if (isWin) {
      activateModal('LESSON_PUZZLE_SUCCESS', {
        primaryAction: () => {
          // TODO: lesson solve api
          navigation.navigate('LessonPuzzleList', {chapter: 1}); // TODO: chapter 다양하게 고치기
        },
      });
    }
    if (isWin === false) {
      activateModal('PUZZLE_FAILURE', {
        primaryAction: () => {
          navigation.navigate('LessonPuzzleList', {chapter: 1});
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

      <PuzzleHeader
        title={title}
        info={description}
        author={author}
        puzzleNum={`${id}`}
      />

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
