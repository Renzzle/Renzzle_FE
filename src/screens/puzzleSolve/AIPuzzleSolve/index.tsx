/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Board from '../../../components/features/Board';
import PuzzleHeader from '../../../components/features/PuzzleHeader';
import { SolveContainer } from './index.styles';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useModal from '../../../hooks/useModal';
import CustomModal from '../../../components/common/CustomModal';
import BottomButtonBar from '../../../components/common/BottomButtonBar';
import { NativeModules } from 'react-native';

const AIPuzzleSolve = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [isWin, setIsWin] = useState<boolean | null>(null);
  const {
    isModalVisible,
    activateModal,
    closePrimarily,
    closeSecondarily,
    category: modalCategory,
  } = useModal();
  const [isLoading, setIsLoading] = useState<boolean | null>(null);

  // TODO: ai api
  const { PuzzleGenerateJNI } = NativeModules;
  const [boardStatus, setBoardStatus] = useState('h8h9i8g8i10i9h11g12j9i11j11k10h7i7');
  const [depth, setDepth] = useState(100);

  const generatePuzzle = async () => {
    try {
      const sequence = await PuzzleGenerateJNI.generatePuzzleWrapper();
      setBoardStatus(sequence);
    } catch (error) {
      console.error('Puzzle generate failed: ', error);
    }
  };

  const transition = [
    {
      text: '생성',
      onAction: async () => {
        await generatePuzzle();
      },
    },
  ];

  useEffect(() => {
    if (isWin) {
      activateModal('RANKING_PUZZLE_SUCCESS', {
        primaryAction: () => {
          navigation.navigate('Home');
        },
      });
    }
    if (isWin === false) {
      activateModal('PUZZLE_FAILURE', {
        primaryAction: () => {
          navigation.navigate('Home');
          // TODO: 실패시 같은 문제 재 도전
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

      <PuzzleHeader title="AI Puzzle Challenge" info="" author="Renzzle" puzzleNum={undefined} />

      <Board
        mode="solve"
        sequence={boardStatus}
        setSequence={setBoardStatus}
        setIsWin={setIsWin}
        setIsLoading={setIsLoading}
        winDepth={depth}
      />

      <BottomButtonBar transitions={transition} />
    </SolveContainer>
  );
};

export default AIPuzzleSolve;
