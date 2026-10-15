import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Animated, Easing, useWindowDimensions, View } from 'react-native';
import RankingCounter, { RankingCounterRef } from '../../components/features/RankingCounter';
import TimerWithProgressBar, { BONUS_TIME } from '../../components/features/TimerWithProgressBar';
import {
  BoardWrapper,
  BottomActionsWrapper,
  Container,
  CounterSlot,
  CurrentPuzzleWrapper,
  FeedbackSkipArea,
  HeaderWrapper,
  ProgressBarContainer,
  StatusHeaderWrapper,
} from './index.styles';
import Board, { BoardRef, GameEndReason } from '../../components/features/Board';
import FlyingBadge, { FlyingBadgeRef } from '../../components/features/FlyingBadge';
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

type PuzzleEndReason = GameEndReason | 'skip';

const RETRY_DELAY_MS = 1000;
// 다섯 돌 강조가 먼저 보이도록 결과 배지를 조금 늦게 띄운다
const BADGE_DELAY_MS = 220;
const SLIDE_OUT_MS = 160;
const SLIDE_IN_MS = 220;

const measureInWindow = (view: Pick<View, 'measureInWindow'> | null) =>
  new Promise<{ x: number; y: number; width: number; height: number } | null>((resolve) => {
    if (!view) {
      resolve(null);
      return;
    }
    view.measureInWindow((x, y, width, height) => resolve({ x, y, width, height }));
  });

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
  const { width: screenWidth } = useWindowDimensions();
  const [isLoading, setIsLoading] = useState<boolean | null>(null);
  const [results, setResults] = useState<GameResult[]>([]);
  const [puzzleData, setPuzzleData] = useState<PuzzleData>();
  // 결과는 배지가 카운터에 닿을 때 세므로, 문제 번호는 다음 문제가 뜰 때 따로 올린다
  const [puzzleNumber, setPuzzleNumber] = useState(1);
  const [isFeedbackPlaying, setIsFeedbackPlaying] = useState(false);
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
  const playedSequencesRef = useRef<Record<string, string>>({});
  const containerRef = useRef<View>(null);
  const timerRef = useRef<View>(null);
  const successCounterRef = useRef<RankingCounterRef>(null);
  const failureCounterRef = useRef<RankingCounterRef>(null);
  const boardAreaRef = useRef<View>(null);
  const resultBadgeRef = useRef<FlyingBadgeRef>(null);
  const bonusBadgeRef = useRef<FlyingBadgeRef>(null);
  const isFeedbackSkippedRef = useRef(false);
  const skipFeedbackDelayRef = useRef<(() => void) | null>(null);
  const boardSlide = useRef(new Animated.Value(0)).current;

  const successCount = results.filter((result) => result.variant === 'success').length;
  const failureCount = results.length - successCount;

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

  // 서버에 결과가 반영되면 끝난 판을 왼쪽으로 빼고 다음 퍼즐을 오른쪽에서 들여온다
  const applyResult = (data: PuzzleData) => {
    // 그사이 정산이 시작됐다면 다음 퍼즐을 띄우지 않는다
    if (isFinishingRef.current) {
      return;
    }

    Animated.timing(boardSlide, {
      toValue: -1,
      duration: SLIDE_OUT_MS,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      if (isFinishingRef.current) {
        boardSlide.setValue(0);
        return;
      }

      boardSlide.setValue(1);
      setPuzzleData(data);
      setPuzzleNumber((prev) => prev + 1);
      setIsPuzzleOver(false);
      Animated.timing(boardSlide, {
        toValue: 0,
        duration: SLIDE_IN_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        isSubmittingRef.current = false;
        setIsSubmitting(false);
      });
    });
  };

  const getResultLabel = (isSolved: boolean, reason?: GameEndReason) => {
    if (reason === 'five') {
      return t(isSolved ? 'rankedFeedback.five' : 'rankedFeedback.opponentFive');
    }
    if (reason === 'forbidden') {
      return t('rankedFeedback.forbidden');
    }
    return t(isSolved ? 'rankedFeedback.solved' : 'rankedFeedback.failed');
  };

  // 결과 배지를 카운터로, 성공이면 보너스 시간 배지를 타이머로 날린다
  const flyResultBadges = async (
    isSolved: boolean,
    reason: GameEndReason | undefined,
    onArrive: () => void,
  ) => {
    const [origin, board, counter, timer] = await Promise.all([
      measureInWindow(containerRef.current),
      measureInWindow(boardAreaRef.current),
      measureInWindow((isSolved ? successCounterRef : failureCounterRef).current),
      measureInWindow(timerRef.current),
    ]);
    if (!origin || !board || !counter || !timer || isFeedbackSkippedRef.current) {
      return;
    }

    const toLocal = (x: number, y: number) => ({ x: x - origin.x, y: y - origin.y });
    const boardCenter = toLocal(board.x + board.width / 2, board.y + board.height / 2);
    const flights = [
      resultBadgeRef.current?.play({
        variant: isSolved ? 'success' : 'error',
        label: getResultLabel(isSolved, reason),
        from: boardCenter,
        to: toLocal(counter.x + counter.width / 2, counter.y + counter.height / 2),
        endScale: 0.4,
        onArrive,
      }),
    ];
    if (isSolved) {
      flights.push(
        bonusBadgeRef.current?.play({
          variant: 'bonus',
          label: t('rankedFeedback.bonusTime', { seconds: BONUS_TIME / 1000 }),
          // 결과 배지가 날아가기 시작할 때 같은 자리에서 튀어나와 타이머로 간다
          from: boardCenter,
          emergeOnFlight: true,
          // 남은 시간 글자는 진행 바 아래에 있다
          to: toLocal(timer.x + timer.width / 2, timer.y + timer.height - 10),
          endScale: 0.6,
        }),
      );
    }
    await Promise.all(flights);
  };

  // 끝난 판을 잠깐 보여주며 결과 배지를 날리고, 배지가 카운터에 닿을 때 결과를 카운터와 타이머에 반영한다
  const playResultFeedback = async (isSolved: boolean, reason?: PuzzleEndReason) => {
    let isCounted = false;
    const countResult = () => {
      if (isCounted) {
        return;
      }
      isCounted = true;
      // 다시 그리기를 기다리지 않고 카운터부터 튀게 한다
      (isSolved ? successCounterRef : failureCounterRef).current?.bump();
      setResults((prev) => [...prev, { variant: isSolved ? 'success' : 'error' }]);
      if (isSolved) {
        setBonusTrigger((prev) => prev + 1);
      }
    };

    if (reason !== 'skip') {
      isFeedbackSkippedRef.current = false;
      setIsFeedbackPlaying(true);
      await new Promise<void>((resolve) => {
        const timer = setTimeout(resolve, BADGE_DELAY_MS);
        skipFeedbackDelayRef.current = () => {
          clearTimeout(timer);
          resolve();
        };
      });
      skipFeedbackDelayRef.current = null;
      if (!isFeedbackSkippedRef.current) {
        await flyResultBadges(isSolved, reason, countResult);
      }
      setIsFeedbackPlaying(false);
    }

    countResult();
  };

  // 연출 중에 화면을 누르면 바로 다음 문제로 넘어간다
  const skipResultFeedback = () => {
    isFeedbackSkippedRef.current = true;
    skipFeedbackDelayRef.current?.();
    resultBadgeRef.current?.finish();
    bonusBadgeRef.current?.finish();
  };

  const handleResult = async (result: boolean | null, reason?: PuzzleEndReason) => {
    // 결과를 보내는 중이거나 정산 중이면 무시한다 (넘기기 연타 등)
    if (result === null || !puzzleData || isSubmittingRef.current || isFinishingRef.current) {
      return;
    }

    const { boardStatus } = puzzleData;
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setIsPuzzleOver(true);

    // 결과 연출과 서버 전송을 함께 진행하고, 둘 다 끝나면 다음 퍼즐로 넘어간다
    const feedback = playResultFeedback(result, reason);
    try {
      // 응답을 못 받고 다시 보낸 결과를 서버가 이중 반영하지 않도록 지금 퍼즐의 보드를 함께 보낸다
      const data = await retryOnce(() => submitRankingGameResult(result, boardStatus));
      await feedback;
      applyResult(data);
    } catch (error) {
      await feedback;
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
        playedSequences: playedSequencesRef.current,
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
        applyResult(data);
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

  const boardSlideStyle = {
    opacity: boardSlide.interpolate({ inputRange: [-1, 0, 1], outputRange: [0.3, 1, 0.3] }),
    transform: [
      {
        translateX: boardSlide.interpolate({
          inputRange: [-1, 1],
          outputRange: [-screenWidth, screenWidth],
        }),
      },
      { scale: boardSlide.interpolate({ inputRange: [-1, 0, 1], outputRange: [0.94, 1, 0.94] }) },
    ],
  };

  return (
    <Container ref={containerRef}>
      <HeaderWrapper>
        <ProgressBarContainer ref={timerRef} collapsable={false}>
          <TimerWithProgressBar
            start={true}
            paused={!!isLoading || isGameFinished || isFinishing || isSubmitting}
            onFinish={handleFinish}
            bonusTimeTrigger={bonusTrigger}
          />
        </ProgressBarContainer>

        <StatusHeaderWrapper>
          <CounterSlot align="left">
            <RankingCounter ref={successCounterRef} variant="success" count={successCount} />
          </CounterSlot>
          <CurrentPuzzleWrapper>
            <CustomText size={20} weight="bold" lineHeight="sm" color="gray/black">
              #{puzzleNumber}
            </CustomText>
            {!!puzzleData && <PuzzleAttributes depth={null} winColor={puzzleData.winColor} />}
          </CurrentPuzzleWrapper>
          <CounterSlot align="right">
            <RankingCounter ref={failureCounterRef} variant="error" count={failureCount} />
          </CounterSlot>
        </StatusHeaderWrapper>
      </HeaderWrapper>

      <BoardWrapper pointerEvents={isSubmitting || isPuzzleOver || isFinishing ? 'none' : 'auto'}>
        <Animated.View ref={boardAreaRef} style={boardSlideStyle}>
          {!!puzzleData && (
            <Board
              // 퍼즐마다 새로 만들어, 이전 퍼즐의 AI 계산이나 선택한 칸이 넘어오지 않게 한다
              key={puzzleNumber}
              ref={boardRef}
              mode="solve"
              sequence={puzzleData.boardStatus}
              setSequence={(sequence) => {
                playedSequencesRef.current[puzzleData.boardStatus] = sequence;
              }}
              setIsWin={handleResult}
              setIsLoading={setIsLoading}
              hideAiIndicator={isFinishing}
              showResultHighlight
              showResultFrame
            />
          )}
        </Animated.View>
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
          onPress={() => handleResult(false, 'skip')}
        />
      </BottomActionsWrapper>

      {isFeedbackPlaying && <FeedbackSkipArea onPress={skipResultFeedback} />}
      <FlyingBadge ref={resultBadgeRef} />
      <FlyingBadge ref={bonusBadgeRef} />

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
