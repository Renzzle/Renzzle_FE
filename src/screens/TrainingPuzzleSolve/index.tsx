import React, { useEffect, useState } from 'react';
import { BoardWrapper, Container, HeaderWrapper } from './index.styles';
import PuzzleHeader from '../../components/features/PuzzleHeader';
import Board from '../../components/features/Board';
import { ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList, TrainingPuzzle } from '../../components/types';
import { CustomModal, CustomText } from '../../components/common';
import { solveTrainingPuzzle } from '../../apis/training';
import { useUserStore } from '../../store/useUserStore';
import useModal from '../../hooks/useModal';
import { GameOutcome } from '../../components/types/Ranking';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

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
  const [isLoading, setIsLoading] = useState(true);
  const [outcome, setOutcome] = useState<GameOutcome>();
  const { updateUser } = useUserStore();

  const handleResult = async (result: boolean | null) => {
    if (result === null || !puzzleDetail) {
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
    }
  };

  useEffect(() => {
    if (route.params.puzzle?.id) {
      setPuzzleDetail(route.params.puzzle);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [route.params.puzzle]);

  if (isLoading) {
    return <Container />;
  }

  if (!puzzleDetail) {
    return (
      <Container>
        <CustomText color="gray/gray500">퍼즐 정보 가져오기 실패</CustomText>
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
        />
      </HeaderWrapper>

      <BoardWrapper>
        <Board
          mode="solve"
          sequence={puzzleDetail.boardStatus}
          setSequence={() => {}}
          setIsWin={handleResult}
          setIsLoading={() => {}}
          winDepth={puzzleDetail.depth}
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
