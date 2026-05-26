/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { BoardWrapper, Container, HeaderWrapper } from './index.styles';
import PuzzleHeader from '../../components/features/PuzzleHeader';
import Board from '../../components/features/Board';
import { ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { GameOutcome, RootStackParamList, TrainingPuzzle } from '../../types';
import { CustomModal } from '../../components/common';
import { openTrainingAnswer, solveTrainingPuzzle } from '../../apis/training';
import { useUserStore } from '../../store/useUserStore';
import useModal from '../../hooks/useModal';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActivityIndicator } from 'react-native';
import theme from '../../styles/theme';
import { showBottomToast } from '../../components/common/Toast/toastMessage';
import { usePuzzleAd } from '../../hooks/usePuzzleAd';
import { useTranslation } from 'react-i18next';

const TrainingPuzzleSolve = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<RootStackParamList, 'TrainingPuzzleSolve'>>();
  const {
    isModalVisible,
    activateModal,
    closePrimarily,
    closeSecondarily,
    category: modalCategory,
  } = useModal();
  const { pack, puzzles, puzzleNumber } = route.params;
  const [currentPuzzleNumber, setCurrentPuzzleNumber] = useState(puzzleNumber);
  const [puzzleDetail, setPuzzleDetail] = useState<TrainingPuzzle | null>(
    puzzles[puzzleNumber - 1],
  );

  const [isLoading, setIsLoading] = useState(false);
  const [outcome, setOutcome] = useState<GameOutcome>();
  const { updateUser } = useUserStore();
  const [boardKey, setBoardKey] = useState(0);

  const { showAdIfReady } = usePuzzleAd();

  const updatedItemsRef = useRef<Map<number, TrainingPuzzle>>(new Map());

  const markSolved = (targetPuzzle: TrainingPuzzle) => {
    const solvedPuzzle = { ...targetPuzzle, isSolved: true };
    updatedItemsRef.current.set(solvedPuzzle.id, solvedPuzzle);
    setPuzzleDetail(solvedPuzzle);
  };

  const handleResult = async (result: boolean | null) => {
    if (result === null || !puzzleDetail) {
      return;
    }
    if (result) {
      const data = await solveTrainingPuzzle(puzzleDetail.id);

      markSolved(puzzleDetail);

      if (data.reward) {
        setOutcome({ reward: data.reward });
      } else {
        setOutcome({ reward: 0 });
      }

      // If there are more puzzles left in the pack
      if (puzzles.length > currentPuzzleNumber) {
        activateModal('TRAINING_PUZZLE_SUCCESS', {
          primaryAction: async () => {
            showAdIfReady(() => {
              setPuzzleDetail(puzzles[currentPuzzleNumber]);
              setCurrentPuzzleNumber((prev) => prev + 1);
            });
          },
          secondaryAction: () => {
            navigation.goBack();
          },
        });
        await updateUser();
      } else {
        // If this is the final puzzle in the pack
        activateModal('TRAINING_PACK_COMPLETE', {
          primaryAction: () => showAdIfReady(() => navigation.goBack()),
        });
        await updateUser();
      }
    } else {
      activateModal('TRAINING_PUZZLE_FAILURE', {
        primaryAction: async () => {
          navigation.goBack();
        },
        secondaryAction: () => {
          handleRetry();
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

        markSolved(puzzleDetail);

        const problemSequence = puzzleDetail.boardStatus;
        const mainSequence = problemSequence + data.answer;

        await updateUser();
        showBottomToast('success', t('toast.purchaseComplete'));
        navigation.navigate('TrainingPuzzleReview', {
          problemSequence,
          mainSequence,
          puzzle: puzzleDetail,
          isCommunityPuzzle: false,
          title: pack.title,
          puzzleNumber: currentPuzzleNumber,
        });
      } catch (error) {
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
    return () => {
      const updatedItems =
        updatedItemsRef.current.size > 0 ? Array.from(updatedItemsRef.current.values()) : undefined;

      navigation.navigate('TrainingPuzzles', {
        pack: pack,
        updatedItems: updatedItems,
      });
    };
  }, []);

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
          title={pack.title ?? puzzleDetail.id.toString()}
          depth={puzzleDetail.depth}
          winColor={puzzleDetail.winColor}
          displayNumber={currentPuzzleNumber}
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
