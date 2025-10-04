/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { BoardWrapper, Container, HeaderWrapper } from './index.styles';
import PuzzleHeader from '../../components/features/PuzzleHeader';
import Board from '../../components/features/Board';
import { ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList, TrainingPuzzle } from '../../components/types';
import { CustomModal } from '../../components/common';
import { solveTrainingPuzzle } from '../../apis/training';
import { useUserStore } from '../../store/useUserStore';
import useModal from '../../hooks/useModal';
import { GameOutcome } from '../../components/types/Ranking';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActivityIndicator } from 'react-native';
import theme from '../../styles/theme';

const TrainingPuzzleSolve = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<RootStackParamList, 'TrainingPuzzleSolve'>>();
  const {
    isModalVisible,
    activateModal,
    closePrimarily,
    closeSecondarily,
    category: modalCategory,
  } = useModal();
  const [puzzleDetail, setPuzzleDetail] = useState<TrainingPuzzle | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [outcome, setOutcome] = useState<GameOutcome>();
  const { updateUser } = useUserStore();
  const [boardKey, setBoardKey] = useState(0);

  const handleResult = async (result: boolean | null) => {
    if (result === null || !puzzleDetail || isLoading) {
      return;
    }
    if (result) {
      const data = await solveTrainingPuzzle(puzzleDetail.id);
      updateUser();
      if (data.reward) {
        setOutcome({ reward: data.reward });
      } else {
        setOutcome({ reward: 0 });
      }

      activateModal('TRAINING_PUZZLE_SUCCESS', {
        primaryAction: () => {
          // TODO: 다음 문제 이동
          console.log('다음문제로 이동');
        },
        secondaryAction: () => {
          navigation.goBack();
        },
      });
    } else {
      activateModal('PUZZLE_FAILURE', {
        primaryAction: async () => {
          navigation.goBack();
        },
      });
    }
  };

  const handleRetry = () => {
    setBoardKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    if (route.params.puzzle?.id) {
      setPuzzleDetail(route.params.puzzle);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [route.params?.puzzle?.id]);

  if (!puzzleDetail) {
    return (
      <Container>
        <ActivityIndicator color={theme.color['main_color/yellow_p']} />
      </Container>
    );
  }

  return (
    <Container>
      <HeaderWrapper>
        <PuzzleHeader
          title={puzzleDetail.title ?? puzzleDetail.id.toString()}
          depth={puzzleDetail.depth}
          winColor={puzzleDetail.winColor}
          displayNumber={puzzleDetail.index}
          isSolved={puzzleDetail.isSolved}
          isCommunityPuzzle={false}
          handleRetry={handleRetry}
          handleShowAnswer={() => {}}
        />
      </HeaderWrapper>

      <BoardWrapper>
        <Board
          key={boardKey}
          mode="solve"
          sequence={puzzleDetail.boardStatus}
          setSequence={() => {}}
          setIsWin={handleResult}
          setIsLoading={setIsLoading}
          winDepth={225}
        />
      </BoardWrapper>

      <CustomModal
        isVisible={isModalVisible}
        category={modalCategory}
        onPrimaryAction={closePrimarily}
        onSecondaryAction={closeSecondarily}
        gameOutcome={outcome}
      />
    </Container>
  );
};

export default TrainingPuzzleSolve;
