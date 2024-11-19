/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { CommunityPuzzleSolveProps } from '../../../components/features/ParamList/index.types';
import { IndicatorContainer, SolveContainer } from './index.styles';
import PuzzleHeader from '../../../components/features/PuzzleHeader';
import GameStatusIndicator from '../../../components/features/GameStatusIndicator';
import Board from '../../../components/features/Board';
import useModal from '../../../hooks/useModal';
import CustomModal from '../../../components/common/CustomModal';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const CommunityPuzzleSolve = ({ route }: CommunityPuzzleSolveProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const { id, boardStatus, title, author, description } = route.params;
  const [isWin, setIsWin] = useState<boolean | null>(null);
  const { isModalVisible, activateModal, closePrimarily, closeSecondarily, category: modalCategory } = useModal();

  useEffect(() => {
    if (isWin) {
      activateModal('COMMUNITY_PUZZLE_SUCCESS', {
        primaryAction: () => {
          navigation.navigate('CommunityPuzzleList');
        },
      });
    }
    if (isWin === false) {
      activateModal('PUZZLE_FAILURE', {
        primaryAction: () => {
          navigation.navigate('CommunityPuzzleList');
        },
      });
    }
  }, [isWin]);

  return (
    <SolveContainer>
      {isModalVisible && <CustomModal isVisible={isModalVisible} category={modalCategory} onPrimaryAction={closePrimarily} onSecondaryAction={closeSecondarily} />}

      <PuzzleHeader
        title={title}
        info={description}
        author={author}
        puzzleNum={`${id}`}
        isLiked={false}
      />

      <IndicatorContainer>
        <GameStatusIndicator />
      </IndicatorContainer>

      <Board mode="solve" sequence={boardStatus} setSequence={() => {}} setIsWin={setIsWin} />
    </SolveContainer>
  );
};

export default CommunityPuzzleSolve;
