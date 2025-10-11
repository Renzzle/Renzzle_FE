import React, { useEffect, useMemo, useState } from 'react';
import { BoardWrapper, Container, HeaderWrapper } from './index.styles';
import PuzzleHeader from '../../components/features/PuzzleHeader';
import Board from '../../components/features/Board';
import { ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList, TrainingPuzzle } from '../../components/types';
import { CustomModal } from '../../components/common';
import { openTrainingAnswer, solveTrainingPuzzle } from '../../apis/training';
import { useUserStore } from '../../store/useUserStore';
import useModal from '../../hooks/useModal';
import { GameOutcome } from '../../components/types/Ranking';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActivityIndicator } from 'react-native';
import theme from '../../styles/theme';
import { showBottomToast } from '../../components/common/Toast/toastMessage';

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
  const puzzleParam = useMemo(() => route.params?.puzzle, [route.params]);
  const [puzzleDetail, setPuzzleDetail] = useState<TrainingPuzzle | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [outcome, setOutcome] = useState<GameOutcome>();
  const { updateUser } = useUserStore();
  const [boardKey, setBoardKey] = useState(0);

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

  const handleShowAnswer = () => {
    if (isLoading || !puzzleDetail?.id) {
      return;
    }

    const openAnswer = async () => {
      setIsLoading(true);
      try {
        const data = await openTrainingAnswer(puzzleDetail.id);
        const problemSequence = puzzleDetail.boardStatus;
        const mainSequence = problemSequence + data.answer;

        await updateUser();
        showBottomToast('success', '구매가 완료되었습니다.');
        navigation.navigate('TrainingPuzzleReview', {
          problemSequence,
          mainSequence,
        });
      } catch (error) {
        console.error('정답 보기 처리 중 오류 발생:', error);
        showBottomToast('error', error as string);
      } finally {
        setIsLoading(false);
      }
    };

    setOutcome({ ...outcome, price: 100 });
    activateModal('PUZZLE_REVIEW_PURCHASE', {
      primaryAction: openAnswer,
    });
  };

  useEffect(() => {
    if (puzzleParam) {
      setPuzzleDetail(puzzleParam);
    }
  }, [puzzleParam]);

  if (!puzzleDetail) {
    return (
      <Container>
        <ActivityIndicator color={theme.color['gray/gray300']} />
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
          handleShowAnswer={handleShowAnswer}
        />
      </HeaderWrapper>

      <BoardWrapper>
        <Board
          key={boardKey}
          mode="solve"
          sequence={puzzleDetail.boardStatus}
          setSequence={() => {}}
          setIsWin={handleResult}
          setIsLoading={() => {}}
          winDepth={225}
        />
      </BoardWrapper>

      <CustomModal
        isVisible={isModalVisible}
        category={modalCategory}
        onPrimaryAction={closePrimarily}
        onSecondaryAction={closeSecondarily}
        gameOutcome={outcome}
        isLoading={isLoading}
      />
    </Container>
  );
};

export default TrainingPuzzleSolve;
