/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Board from '../../../components/features/Board';
import PuzzleHeader from '../../../components/features/PuzzleHeader';
import GameStatusIndicator, { IndicatorCategoryType } from '../../../components/features/GameStatusIndicator';
import {IndicatorContainer, SolveContainer } from './index.styles';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useModal from '../../../hooks/useModal';
import CustomModal from '../../../components/common/CustomModal';
import BottomButtonBar from '../../../components/common/BottomButtonBar';
import { NativeModules } from 'react-native';

const AIPuzzleSolve = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [isWin, setIsWin] = useState<boolean | null>(null);
  const { isModalVisible, activateModal, closePrimarily, closeSecondarily, category: modalCategory } = useModal();
  const [isLoading, setIsLoading] = useState<boolean | null>(null);
  const [category, setCategory] = useState<IndicatorCategoryType>();

  // TODO: ai api
  // const { JNIModuleName } = NativeModules;
  const [boardStatus, setBoardStatus] = useState('h8h9i8g8i10i9h11g12j9i11j11k10h7i7');
  const [depth, setDepth] = useState(7);

  const generatePuzzle = async () => {
    try {
      // const sequence = await JNIModuleName.JNIfunctionName();
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
      activateModal('AI_PUZZLE_SUCCESS', {
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
        title="AI Puzzle Challenge"
        info=""
        author="Renzzle"
        puzzleNum={undefined}
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

      <BottomButtonBar transitions={transition} />
    </SolveContainer>
  );
};

export default AIPuzzleSolve;
