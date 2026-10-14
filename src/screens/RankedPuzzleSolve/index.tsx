import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import RankingCounter from '../../components/features/RankingCounter';
import TimerWithProgressBar from '../../components/features/TimerWithProgressBar';
import {
  BoardWrapper,
  BottomActionsWrapper,
  Container,
  CounterSlot,
  CurrentPuzzleWrapper,
  HeaderWrapper,
  ProgressBarContainer,
  StatusHeaderWrapper,
} from './index.styles';
import Board, { BoardRef } from '../../components/features/Board';
import {
  finishRankingGame,
  getMyRating,
  startRankingGame,
  submitRankingGameResult,
} from '../../apis/rank';
import { isNoResponseError } from '../../apis/interceptor';
import { CustomModal, CustomText } from '../../components/common';
import useModal from '../../hooks/useModal';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GameOutcome, GameResult } from '../../types';
import { showBottomToast } from '../../components/common/Toast/toastMessage';
import PuzzleAttributes from '../../components/features/PuzzleAttributes';
import { useUserStore } from '../../store/useUserStore';
import { useTranslation } from 'react-i18next';
import type { ScrollView } from 'react-native';
import PuzzleActionButton from '../../components/features/PuzzleActionButton';

interface PuzzleData {
  boardStatus: string;
  winColor: 'BLACK' | 'WHITE';
}

type FailedRequest = { type: 'result'; isSolved: boolean; boardStatus: string } | { type: 'end' };

const RETRY_DELAY_MS = 1000;

// 실패하면 한 번 더 보낸다
const retryOnce = async <T,>(request: () => Promise<T>): Promise<T> => {
  try {
    return await request();
  } catch {
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    return request();
  }
};

const RankedPuzzleSolve = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const {
    isModalVisible,
    activateModal,
    closePrimarily,
    closeSecondarily,
    category: modalCategory,
  } = useModal();
  const { updateUser } = useUserStore();
  const [isLoading, setIsLoading] = useState<boolean | null>(null);
  const [results, setResults] = useState<GameResult[]>([]);
  const [puzzleData, setPuzzleData] = useState<PuzzleData>();
  const [bonusTrigger, setBonusTrigger] = useState(0);
  const [shouldFinish, setShouldFinish] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const isFinishingRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const [isPuzzleOver, setIsPuzzleOver] = useState(false);
  const [failure, setFailure] = useState<{ request: FailedRequest; reason: string } | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const isRetryingRef = useRef(false);
  const canLeaveRef = useRef(false);
  const boardRef = useRef<BoardRef>(null);
  const startRatingRef = useRef<number | null>(null);

  const successCount = results.filter((result) => result.variant === 'success').length;
  const failureCount = results.length - successCount;
  const currentPuzzleNumber = results.length + 1;

  // 정산 없이 게임 화면을 나간다
  const leaveGame = useCallback(() => {
    if (canLeaveRef.current) {
      return;
    }
    canLeaveRef.current = true;
    navigation.goBack();
  }, [navigation]);

  const getFailureReason = useCallback(
    (error: unknown) => {
      if (isNoResponseError(error)) {
        return t('modal.rankingRequestFailed.disconnected');
      }
      return typeof error === 'string' ? error : t('modal.rankingRequestFailed.serverError');
    },
    [t],
  );

  useEffect(() => {
    const fetchStartRating = async () => {
      try {
        const data = await getMyRating();
        startRatingRef.current = data?.rating ?? null;
      } catch (error) {
        // 시작 레이팅을 못 받아도 게임 진행에는 지장 없음 (결과 화면에서 변동치만 미표시)
        startRatingRef.current = null;
      }
    };

    const initializeGame = async () => {
      try {
        setIsLoading(true);
        const initialData = await startRankingGame();
        setPuzzleData(initialData);
      } catch (error) {
        showBottomToast('error', error as string);

        canLeaveRef.current = true;
        navigation.goBack();
      } finally {
        setIsLoading(false);
      }
    };

    fetchStartRating();
    initializeGame();
  }, [navigation]);

  // 서버에 결과가 반영된 뒤 다음 퍼즐로 넘어간다
  const applyResult = (data: PuzzleData, isSolved: boolean) => {
    // 그사이 정산이 시작됐다면 다음 퍼즐을 띄우지 않는다
    if (isFinishingRef.current) {
      return;
    }

    if (isSolved) {
      setBonusTrigger((prev) => prev + 1);
    }
    setPuzzleData(data);
    setIsPuzzleOver(false);
    setResults((prev) => [...prev, { variant: isSolved ? 'success' : 'error' }]);
    isSubmittingRef.current = false;
    setIsSubmitting(false);
  };

  const handleResult = async (result: boolean | null) => {
    // 결과를 보내는 중이거나 정산 중이면 무시한다 (넘기기 연타 등)
    if (result === null || !puzzleData || isSubmittingRef.current || isFinishingRef.current) {
      return;
    }

    const { boardStatus } = puzzleData;
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setIsPuzzleOver(true);

    if (result) {
      showBottomToast('success', t('modal.rankingPuzzleSuccess.message'));
    } else {
      showBottomToast('error', t('modal.rankingPuzzleFailure.message'));
    }

    try {
      // 응답을 못 받고 다시 보낸 결과를 서버가 이중 반영하지 않도록 지금 퍼즐의 보드를 함께 보낸다
      const data = await retryOnce(() => submitRankingGameResult(result, boardStatus));
      applyResult(data, result);
    } catch (error) {
      if (!isFinishingRef.current) {
        setFailure({
          request: { type: 'result', isSolved: result, boardStatus },
          reason: getFailureReason(error),
        });
      }
    }
  };

  const completeGame = useCallback(
    async (data: GameOutcome) => {
      setIsGameFinished(true);
      await updateUser();

      const ratingDelta =
        startRatingRef.current !== null && data.rating !== undefined
          ? data.rating - startRatingRef.current
          : undefined;

      canLeaveRef.current = true;
      navigation.replace('RankedGameResult', {
        rating: data.rating,
        reward: data.reward,
        ratingDelta,
      });
    },
    [navigation, updateUser],
  );

  const handleFinish = useCallback(async () => {
    // 조기 종료 후 타이머가 0초에 도달해도 이중 정산되지 않도록 가드
    if (isFinishingRef.current) {
      return;
    }
    isFinishingRef.current = true;

    // 진행 중인 AI 턴은 더 이상 의미 없으므로 취소하고, 정산 동안 조작을 잠근다
    boardRef.current?.cancelAiTurn();
    setIsFinishing(true);
    setIsLoading(true);

    try {
      const data: GameOutcome = await retryOnce(finishRankingGame);
      await completeGame(data);
    } catch (error) {
      setFailure({ request: { type: 'end' }, reason: getFailureReason(error) });
    }
  }, [completeGame, getFailureReason]);

  // 실패 모달이 떠 있는 동안 게임은 멈춰 있고, 다시 시도하거나 나갈 수 있다
  const handleRetry = async () => {
    if (!failure || isRetryingRef.current) {
      return;
    }
    isRetryingRef.current = true;
    setIsRetrying(true);

    const { request } = failure;
    try {
      if (request.type === 'result') {
        const data = await submitRankingGameResult(request.isSolved, request.boardStatus);
        setFailure(null);
        applyResult(data, request.isSolved);
      } else {
        const data: GameOutcome = await finishRankingGame();
        setFailure(null);
        await completeGame(data);
      }
    } catch (error) {
      setFailure({ request, reason: getFailureReason(error) });
    } finally {
      isRetryingRef.current = false;
      setIsRetrying(false);
    }
  };

  const handleLeaveAfterFailure = () => {
    setFailure(null);
    leaveGame();
  };

  // 종료 확인 모달이 닫힌 뒤에 게임을 정산해야 결과 모달이 바로 닫히지 않는다
  useEffect(() => {
    if (!shouldFinish) {
      return;
    }
    setShouldFinish(false);
    handleFinish();
  }, [shouldFinish, handleFinish]);

  const handleEndGamePress = () => {
    activateModal('RANKING_GAME_END_CONFIRM', {
      primaryAction: () => {
        setShouldFinish(true);
      },
      secondaryAction: () => {},
    });
  };

  // 스와이프로 나가면 종료 확인을 띄울 수 없으므로 막는다 (native-stack은 beforeRemove로 제스처를 막지 못한다)
  useLayoutEffect(() => {
    navigation.setOptions({ gestureEnabled: false });
  }, [navigation]);

  // 게임 중에 나가면 정산되지 않아 푼 퍼즐의 보상을 못 받으므로, 나가기 전에 종료할지 묻는다
  useEffect(() => {
    return navigation.addListener('beforeRemove', (e) => {
      if (canLeaveRef.current || !puzzleData) {
        return;
      }

      e.preventDefault();
      if (!isFinishingRef.current) {
        handleEndGamePress();
      }
    });
  });

  return (
    <Container>
      <HeaderWrapper>
        <ProgressBarContainer>
          <TimerWithProgressBar
            start={true}
            paused={!!isLoading || isGameFinished || isFinishing || isSubmitting}
            onFinish={handleFinish}
            bonusTimeTrigger={bonusTrigger}
          />
        </ProgressBarContainer>

        <StatusHeaderWrapper>
          <CounterSlot align="left">
            <RankingCounter variant="success" count={successCount} />
          </CounterSlot>
          <CurrentPuzzleWrapper>
            <CustomText size={20} weight="bold" lineHeight="sm" color="gray/black">
              #{currentPuzzleNumber}
            </CustomText>
            {!!puzzleData && <PuzzleAttributes depth={null} winColor={puzzleData.winColor} />}
          </CurrentPuzzleWrapper>
          <CounterSlot align="right">
            <RankingCounter variant="error" count={failureCount} />
          </CounterSlot>
        </StatusHeaderWrapper>
      </HeaderWrapper>

      <BoardWrapper pointerEvents={isSubmitting || isPuzzleOver || isFinishing ? 'none' : 'auto'}>
        {!!puzzleData && (
          <Board
            // 퍼즐마다 새로 만들어, 이전 퍼즐의 AI 계산이나 선택한 칸이 넘어오지 않게 한다
            key={currentPuzzleNumber}
            ref={boardRef}
            mode="solve"
            sequence={puzzleData.boardStatus}
            setSequence={() => {}}
            setIsWin={handleResult}
            setIsLoading={setIsLoading}
            hideAiIndicator={isFinishing}
          />
        )}
      </BoardWrapper>

      <BottomActionsWrapper>
        <PuzzleActionButton
          mode="endGame"
          disabled={!!isLoading || isSubmitting}
          onPress={handleEndGamePress}
        />
        <PuzzleActionButton
          mode="skip"
          disabled={!!isLoading || isSubmitting || isFinishing}
          onPress={() => handleResult(false)}
        />
      </BottomActionsWrapper>

      <CustomModal
        isVisible={isModalVisible}
        category={modalCategory}
        onPrimaryAction={closePrimarily}
        onSecondaryAction={closeSecondarily}
      />

      <CustomModal
        isVisible={!!failure}
        category="RANKING_REQUEST_FAILED"
        onPrimaryAction={handleRetry}
        onSecondaryAction={handleLeaveAfterFailure}
        isLoading={isRetrying}>
        <CustomText size={12} lineHeight="lg" color="gray/gray500">
          {failure?.reason}
        </CustomText>
      </CustomModal>
    </Container>
  );
};

export default RankedPuzzleSolve;
