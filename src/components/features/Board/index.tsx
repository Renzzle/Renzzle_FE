import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  BoardBackground,
  CellContainer,
  FramContainer,
  FrameCell,
  FrameRow,
  IndicatePoint,
  LastMoveHighlight,
  Stone,
  StoneRow,
} from './index.styles';
import useDeviceWidth from '../../../hooks/useDeviceWidth';
import BoardFrameNumber from './BoardFrameNumber';
import {
  BOARD_SIZE,
  coordinatesToPosition,
  convertLowercaseAlphabetToNumber,
  convertToLowercaseAlphabet,
  convertToReverseNumber,
  getSequenceDepth,
  positionToValue,
  valueToCoordinates,
} from '../../../utils/utils';
import { Animated, Easing, NativeModules, ViewStyle } from 'react-native';
import { CustomText, Icon } from '../../common';
import { showBottomToast } from '../../common/Toast/toastMessage';
import { useTranslation } from 'react-i18next';
import {
  getPuzzleCacheAiResponse,
  PuzzleCacheType,
  savePuzzleCache,
} from '../../../apis/puzzleCache';
import useCancellableNativeRequest from '../../../hooks/useCancellableNativeRequest';
import useDelayedVisibility from '../../../hooks/useDelayedVisibility';
import AiThinkingIndicator from './AiThinkingIndicator';

export type StoneType = 0 | 1 | 2; // 0: Empty, 1: Black, 2: White

type PuzzleAiBenchmarkMode = 'LOCAL_ONLY' | 'CACHE';
type PuzzleAiAnswerSource = 'local-only' | 'cache-hit' | 'cache-miss' | 'cache-fallback';

const PUZZLE_AI_BENCHMARK_MODE = 'CACHE' as PuzzleAiBenchmarkMode;
const IS_AI_BENCHMARK_ENABLED = __DEV__;

const getPuzzleAiMode = (): PuzzleAiBenchmarkMode => {
  return __DEV__ ? PUZZLE_AI_BENCHMARK_MODE : 'CACHE';
};

interface AiBenchmarkResult {
  mode: PuzzleAiBenchmarkMode;
  source: PuzzleAiAnswerSource;
  turnStartedAt: number;
  boardDepth: number;
  puzzleType?: PuzzleCacheType;
  puzzleId?: number;
  cacheLookupMs?: number;
  localAiMs?: number;
  answerReadyMs: number;
  aiAnswer: number;
  position?: string | null;
}

interface CellType {
  stone: StoneType;
  moveNumber: number | null;
}

export interface BoardRef {
  undo: () => void;
  redo: () => void;
  cancelAiTurn: () => void;
}

const createEmptyBoard = (): CellType[][] => {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => ({
      stone: 0, // 비어있음
      moveNumber: null, // 순서없음
    })),
  );
};

type AiMoveResponse =
  | {
      status: 'ok';
      move: number;
    }
  | {
      status: 'cancelled';
    };

interface BoardProps {
  mode: 'make' | 'solve';
  makeMode?: 'create' | 'review';
  sequence: string;
  setSequence: (sequence: string) => void;
  setIsWin?: (isWin: boolean | null) => void;
  setIsLoading?: (isLoading: boolean) => void;

  // 'review' mode
  mainSequence?: string; // 정답까지 포함된 전체 시퀀스
  problemSequence?: string; // 사용자가 시작할 문제 시퀀스

  // undo/redo 가능 여부를 부모에게 알리는 콜백
  onUndoRedoStateChange?: (canUndo: boolean, canRedo: boolean) => void;

  puzzleCache?: {
    puzzleType: PuzzleCacheType;
    puzzleId: number;
  };

  // 게임 정산 등 AI 응답이 더 이상 의미 없는 상황에서 생각 중 인디케이터를 즉시 숨김
  hideAiIndicator?: boolean;
}

const Board = forwardRef<BoardRef, BoardProps>(function Board(
  {
    mode,
    makeMode,
    sequence = '',
    setSequence,
    setIsWin,
    setIsLoading,
    mainSequence = '',
    problemSequence = '',
    onUndoRedoStateChange,
    puzzleCache,
    hideAiIndicator = false,
  },
  ref,
) {
  const { t } = useTranslation();

  const width = useDeviceWidth();
  const boardWidth = width - 20;
  const cellWidth = (boardWidth - 26) / 14;

  const { UserAgainstActionJNI, CheckWinJNI } = NativeModules;
  const [board, setBoard] = useState<CellType[][]>(createEmptyBoard());
  const [isBlackTurn, setIsBlackTurn] = useState(true);
  const [stoneX, setStoneX] = useState<number | null>(null);
  const [stoneY, setStoneY] = useState<number | null>(null);

  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [localSequence, setLocalSequence] = useState(sequence);

  const isAiThinkingVisible =
    useDelayedVisibility(mode === 'solve' && isDisabled) && !hideAiIndicator;

  const [history, setHistory] = useState<string[]>([sequence]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Benchmark Ref
  const aiBenchmarkRef = useRef<AiBenchmarkResult | null>(null);

  // Cancellable Request Refs
  const isMountedRef = useRef(true);
  const checkWinRequestIdRef = useRef(0);

  const cancelCalculate = useCallback(
    (activeRequestId: number) => {
      UserAgainstActionJNI.cancelCalculate?.(activeRequestId);
    },
    [UserAgainstActionJNI],
  );

  const {
    cancelActiveRequest: cancelActiveAiRequest,
    finishRequest: finishAiRequest,
    isActiveRequest: isActiveAiRequest,
    scheduleRequest: scheduleAiRequest,
  } = useCancellableNativeRequest({ cancelRequest: cancelCalculate });

  const cancelActiveAiTurn = useCallback(
    (resetUi = false) => {
      cancelActiveAiRequest();
      if (resetUi) {
        setIsDisabled(false);
        setIsLoading?.(false);
      }
    },
    [cancelActiveAiRequest, setIsLoading],
  );

  useImperativeHandle(
    ref,
    () => ({
      cancelAiTurn: () => {
        cancelActiveAiTurn(true);
      },
      undo: () => {
        if (mode !== 'make') {
          return;
        }

        if (makeMode === 'create') {
          if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
          }
        } else if (makeMode === 'review') {
          if (localSequence.length > problemSequence.length) {
            const lastMoveMatch = localSequence.match(/[a-o](?:1[0-5]|[1-9])$/);
            if (lastMoveMatch) {
              const lastMove = lastMoveMatch[0];
              const newSequence = localSequence.slice(0, -lastMove.length);
              setLocalSequence(newSequence);
              setSequence(newSequence);
            }
          }
        }
      },
      redo: () => {
        if (mode !== 'make') {
          return;
        }

        if (makeMode === 'create') {
          if (currentIndex < history.length - 1) {
            setCurrentIndex(currentIndex + 1);
          }
        } else if (makeMode === 'review') {
          if (
            localSequence.length < mainSequence.length &&
            mainSequence.startsWith(localSequence)
          ) {
            const nextMoveMatch = mainSequence
              .substring(localSequence.length)
              .match(/^[a-o](?:1[0-5]|[1-9])/);
            if (nextMoveMatch) {
              const nextMove = nextMoveMatch[0];
              const newSequence = localSequence + nextMove;
              setLocalSequence(newSequence);
              setSequence(newSequence);
            }
          }
        }
      },
    }),
    [
      cancelActiveAiTurn,
      currentIndex,
      history.length,
      localSequence,
      mainSequence,
      makeMode,
      mode,
      problemSequence,
      setSequence,
    ],
  );

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const updateBoard = useCallback(
    (x: number, y: number, isBlackStone = isBlackTurn) => {
      setBoard((currentBoard) => {
        const newBoard: CellType[][] = currentBoard.map((row) => row.map((cell) => ({ ...cell })));

        for (let i = 0; i < BOARD_SIZE; i++) {
          for (let j = 0; j < BOARD_SIZE; j++) {
            if (newBoard[i][j].moveNumber === -1) {
              newBoard[i][j].moveNumber = null;
            }
          }
        }

        newBoard[x][y] = {
          stone: isBlackStone ? 1 : 2,
          moveNumber: -1,
        };

        return newBoard;
      });
    },
    [isBlackTurn],
  );

  const addToSequence = useCallback(
    (x: number, y: number, baseSequence = localSequence) => {
      const letter = convertToLowercaseAlphabet(y);
      const number = convertToReverseNumber(x).toString();
      const updatedSequence = baseSequence + letter + number;

      if (mode === 'make' && makeMode === 'create') {
        const newHistory = [...history.slice(0, currentIndex + 1), updatedSequence];
        setHistory(newHistory);
        setCurrentIndex(newHistory.length - 1);
        setLocalSequence(updatedSequence);
        setSequence(updatedSequence);
      } else {
        setLocalSequence(updatedSequence);
        setSequence(updatedSequence);
      }

      return updatedSequence;
    },
    [currentIndex, history, localSequence, makeMode, mode, setSequence],
  );

  const getCachedAiAnswer = useCallback(
    async (
      userSequence: string,
    ): Promise<{
      answer: number | null;
      shouldSave: boolean;
      cacheLookupMs?: number;
      position?: string | null;
    }> => {
      if (!puzzleCache) {
        return { answer: null, shouldSave: false };
      }

      try {
        const cacheStartedAt = IS_AI_BENCHMARK_ENABLED ? Date.now() : 0;
        const cache = await getPuzzleCacheAiResponse({
          ...puzzleCache,
          currentBoardState: userSequence,
        });
        const cacheLookupMs = IS_AI_BENCHMARK_ENABLED ? Date.now() - cacheStartedAt : undefined;

        if (!cache.position) {
          return { answer: null, shouldSave: true, cacheLookupMs, position: null };
        }

        const cachedAnswer = positionToValue(cache.position);

        return { answer: cachedAnswer, shouldSave: false, cacheLookupMs, position: cache.position };
      } catch (error) {
        console.log('AI cache request failed:', error);
        return { answer: null, shouldSave: false };
      }
    },
    [puzzleCache],
  );

  const saveAiAnswerCache = useCallback(
    (userSequence: string, aiResult: number) => {
      if (!puzzleCache) {
        return;
      }

      const coordinates = valueToCoordinates(aiResult);
      if (!coordinates) {
        return;
      }

      const answerPuzzle = coordinatesToPosition(coordinates.x, coordinates.y);
      if (!answerPuzzle) {
        return;
      }

      const saveStartedAt = IS_AI_BENCHMARK_ENABLED ? Date.now() : 0;
      savePuzzleCache({
        ...puzzleCache,
        currentBoardState: userSequence,
        answerPuzzle,
      })
        .then((response) => {
          if (IS_AI_BENCHMARK_ENABLED) {
            console.log('[AiBenchmark] cache save:', {
              puzzleType: puzzleCache.puzzleType,
              puzzleId: puzzleCache.puzzleId,
              boardDepth: getSequenceDepth(userSequence),
              isSuccess: response.isSuccess,
              ms: Date.now() - saveStartedAt,
              answerPuzzle,
            });
          }
        })
        .catch((error) => {
          console.log('AI cache save failed:', error);
        });
    },
    [puzzleCache],
  );

  const logAiBenchmark = useCallback((result: 'move-applied' | 'ai-win' | 'terminal') => {
    if (!IS_AI_BENCHMARK_ENABLED) {
      return;
    }

    const benchmark = aiBenchmarkRef.current;
    if (!benchmark) {
      return;
    }

    const { turnStartedAt, ...payload } = benchmark;
    console.log(`[AiBenchmark] ${benchmark.source}:`, {
      ...payload,
      turnCompleteMs: Date.now() - turnStartedAt,
      result,
    });

    aiBenchmarkRef.current = null;
  }, []);

  const checkWin = useCallback(
    (sequenceToCheck: string): Promise<boolean | null> => {
      checkWinRequestIdRef.current += 1;
      const requestId = checkWinRequestIdRef.current;

      return new Promise((resolve) => {
        setTimeout(async () => {
          if (!isMountedRef.current || checkWinRequestIdRef.current !== requestId) {
            resolve(null);
            return;
          }

          try {
            const check = await CheckWinJNI.checkWinWrapper(sequenceToCheck);
            if (!isMountedRef.current || checkWinRequestIdRef.current !== requestId) {
              resolve(null);
              return;
            }

            resolve(check === 1);
          } catch (error) {
            if (!isMountedRef.current || checkWinRequestIdRef.current !== requestId) {
              resolve(null);
              return;
            }

            console.log(error);
            showBottomToast('error', t('toast.numberProcessingError'));
            resolve(false);
          }
        }, 0);
      });
    },
    [CheckWinJNI, t],
  );

  const handleAiTurn = useCallback(
    (userSequence: string, aiIsBlackTurn: boolean) => {
      scheduleAiRequest(async (requestId) => {
        try {
          const aiMode = getPuzzleAiMode();
          const turnStartedAt = IS_AI_BENCHMARK_ENABLED ? Date.now() : 0;
          aiBenchmarkRef.current = null;

          const {
            answer: cachedAnswer,
            shouldSave,
            cacheLookupMs,
            position,
          } = aiMode === 'CACHE'
            ? await getCachedAiAnswer(userSequence)
            : {
                answer: null,
                shouldSave: false,
                cacheLookupMs: undefined,
                position: undefined,
              };

          if (!isActiveAiRequest(requestId)) {
            return;
          }

          let result: number;
          let source: PuzzleAiAnswerSource;
          let localAiMs: number | undefined;

          if (cachedAnswer !== null) {
            source = 'cache-hit';
            result = cachedAnswer;
          } else {
            source =
              aiMode === 'LOCAL_ONLY' ? 'local-only' : shouldSave ? 'cache-miss' : 'cache-fallback';
            const localAiStartedAt = IS_AI_BENCHMARK_ENABLED ? Date.now() : 0;

            const response = (await UserAgainstActionJNI.calculateSomethingWrapper(
              requestId,
              userSequence,
            )) as AiMoveResponse | number;

            if (!isActiveAiRequest(requestId)) {
              return;
            }

            if (typeof response !== 'number' && response.status === 'cancelled') {
              finishAiRequest(requestId);
              setIsDisabled(false);
              setIsLoading?.(false);
              return;
            }

            result = typeof response === 'number' ? response : response.move;
            localAiMs = Date.now() - localAiStartedAt;
          }

          if (IS_AI_BENCHMARK_ENABLED) {
            aiBenchmarkRef.current = {
              mode: aiMode,
              source,
              turnStartedAt,
              boardDepth: getSequenceDepth(userSequence),
              puzzleType: puzzleCache?.puzzleType,
              puzzleId: puzzleCache?.puzzleId,
              cacheLookupMs,
              localAiMs,
              answerReadyMs: Date.now() - turnStartedAt,
              aiAnswer: result,
              position,
            };
          }

          if (result === -1) {
            logAiBenchmark('terminal');
            finishAiRequest(requestId);
            setIsWin?.(false);
            setIsLoading?.(false);
            setIsDisabled(false);
            return;
          }

          if (result === 1000) {
            logAiBenchmark('terminal');
            finishAiRequest(requestId);
            setIsWin?.(true);
            setIsLoading?.(false);
            setIsDisabled(false);
            return;
          }

          if (shouldSave && result !== -1 && result !== 1000) {
            saveAiAnswerCache(userSequence, result);
          }

          const coordinates = valueToCoordinates(result);
          if (!coordinates) {
            finishAiRequest(requestId);
            setIsDisabled(false);
            setIsLoading?.(false);
            return;
          }

          const { x, y } = coordinates;
          const newSequence = addToSequence(x, y, userSequence);
          const isAiWin = await checkWin(newSequence);

          if (isAiWin === null || !isActiveAiRequest(requestId)) {
            return;
          }

          if (isAiWin) {
            logAiBenchmark('ai-win');
            finishAiRequest(requestId);
            setIsWin?.(false);
            setIsLoading?.(false);
            setIsDisabled(false);
            return;
          }

          updateBoard(x, y, aiIsBlackTurn);
          setIsBlackTurn(!aiIsBlackTurn);
          finishAiRequest(requestId);
          setIsDisabled(false);
          setIsLoading?.(false);
          logAiBenchmark('move-applied');
        } catch (error) {
          if (isActiveAiRequest(requestId)) {
            finishAiRequest(requestId);
            setIsDisabled(false);
            setIsLoading?.(false);
            showBottomToast('error', t('toast.aiCalculationFailed'));
          }
        }
      });
    },
    [
      UserAgainstActionJNI,
      addToSequence,
      checkWin,
      finishAiRequest,
      getCachedAiAnswer,
      isActiveAiRequest,
      logAiBenchmark,
      puzzleCache,
      saveAiAnswerCache,
      scheduleAiRequest,
      setIsLoading,
      setIsWin,
      t,
      updateBoard,
    ],
  );

  const handlePut = useCallback(async () => {
    if (stoneX === undefined || stoneY === undefined || stoneX === null || stoneY === null) {
      return;
    }

    if (board[stoneX][stoneY].stone !== 0) {
      return;
    }

    const newSequence = addToSequence(stoneX, stoneY);
    updateBoard(stoneX, stoneY);
    setIsBlackTurn(!isBlackTurn);
    setStoneX(null);
    setStoneY(null);

    if (mode === 'solve') {
      const isUserWin = await checkWin(newSequence);

      if (isUserWin === null) {
        return;
      }

      if (isUserWin) {
        setIsWin?.(true);
        setIsLoading?.(false);
        setIsDisabled(false);
        return;
      }

      setIsDisabled(true);
      setIsLoading?.(true);
      handleAiTurn(newSequence, !isBlackTurn);
    }
  }, [
    addToSequence,
    board,
    checkWin,
    handleAiTurn,
    isBlackTurn,
    mode,
    setIsLoading,
    setIsWin,
    stoneX,
    stoneY,
    updateBoard,
  ]);

  const handleCellPress = useCallback(
    (x: number, y: number) => {
      if (isDisabled) {
        return;
      }

      if (stoneX === x && stoneY === y) {
        handlePut();
      } else {
        setStoneX(x);
        setStoneY(y);
      }
    },
    [handlePut, isDisabled, stoneX, stoneY],
  );

  useEffect(() => {
    if (mode === 'make' && makeMode === 'create') {
      const currentSequence = history[currentIndex];
      setLocalSequence(currentSequence);
      setSequence(currentSequence);
    }
  }, [currentIndex, history, mode, makeMode, setSequence]);

  useEffect(() => {
    if (mode !== 'make' || !onUndoRedoStateChange) {
      return;
    }
    let canUndo = false;
    let canRedo = false;

    if (makeMode === 'create') {
      canUndo = currentIndex > 0;
      canRedo = currentIndex < history.length - 1;
    } else if (makeMode === 'review') {
      const isSubPath = mainSequence.startsWith(localSequence);
      canUndo = localSequence.length > problemSequence.length;
      if (isSubPath) {
        canRedo = localSequence.length < mainSequence.length;
      }
    }

    onUndoRedoStateChange(canUndo, canRedo);
  }, [
    localSequence,
    currentIndex,
    history,
    mainSequence,
    problemSequence,
    mode,
    makeMode,
    onUndoRedoStateChange,
  ]);

  const initializeBoard = useCallback(() => {
    const newBoard = createEmptyBoard();
    let turn = true;
    const problemSequenceLength = problemSequence ? getSequenceDepth(problemSequence) : 0;

    let moveIndex = 0;
    let i = 0;
    let lastX = -1;
    let lastY = -1;
    while (i < sequence.length) {
      const letter = sequence[i];
      const numberMatch = sequence.slice(i + 1).match(/^\d{1,2}/);
      if (!numberMatch) {
        showBottomToast('error', t('toast.invalidProblemFormat'));
        break;
      }

      const number = numberMatch[0];
      const x = convertToReverseNumber(parseInt(number, 10));
      const y = convertLowercaseAlphabetToNumber(letter);

      let moveNumber = null;
      if (mode === 'make' && moveIndex >= problemSequenceLength) {
        moveNumber = moveIndex + 1 - problemSequenceLength;
      }

      if (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
        newBoard[x][y] = { stone: turn ? 1 : 2, moveNumber: moveNumber };
        turn = !turn;
        moveIndex++;
        lastX = x;
        lastY = y;
      }
      i += 1 + number.length;
    }

    // 초기 시퀀스의 마지막 수에도 마지막 수 마커 표시 (수순 번호가 있는 돌은 유지)
    if (lastX >= 0 && lastY >= 0 && newBoard[lastX][lastY].moveNumber === null) {
      newBoard[lastX][lastY].moveNumber = -1;
    }

    setLocalSequence(sequence);
    setBoard(newBoard);
    setIsBlackTurn(turn);
  }, [mode, problemSequence, sequence, t]);

  useEffect(() => {
    initializeBoard();
  }, [initializeBoard]);

  return (
    <BoardBackground boardWidth={boardWidth}>
      <BoardFrameNumber direction="vertical" />
      <BoardFrameNumber direction="horizontal" />
      <FramContainer>
        {Array.from({ length: BOARD_SIZE - 1 }).map((_, rowIndex) => (
          <FrameRow key={rowIndex}>
            {Array.from({ length: BOARD_SIZE - 1 }).map((__, colIndex) => (
              <FrameCell key={colIndex} cellWidth={cellWidth} />
            ))}
          </FrameRow>
        ))}
      </FramContainer>
      {board.map((row, x) => (
        <StoneRow key={x}>
          {row.map((cell, y) => (
            <Cell
              key={`${x}-${y}`}
              pos={`${x}-${y}`}
              stone={cell.stone}
              cellWidth={cellWidth}
              stoneX={stoneX}
              stoneY={stoneY}
              sequence={cell.moveNumber}
              onPress={() => handleCellPress(x, y)}
              pulseLastMove={isAiThinkingVisible}
            />
          ))}
        </StoneRow>
      ))}
      {mode === 'solve' && <AiThinkingIndicator visible={isAiThinkingVisible} />}
    </BoardBackground>
  );
});

// highlight the last move with a pulsing animation
const PulsingLastMoveHighlight = ({ width }: { width: number }) => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.5,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();

    return () => pulse.stop();
  }, [scale]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <LastMoveHighlight width={width} />
    </Animated.View>
  );
};

interface CellProps {
  pos: string;
  stone: StoneType;
  cellWidth: number;
  stoneX: number | null | undefined;
  stoneY: number | null | undefined;
  sequence: number | null;
  onPress: () => void;
  showHighlights?: boolean;
  pulseLastMove?: boolean;
  style?: ViewStyle;
}

export const Cell = ({
  pos,
  stone,
  cellWidth,
  stoneX,
  stoneY,
  sequence,
  onPress,
  showHighlights = true,
  pulseLastMove = false,
  style,
}: CellProps) => {
  return (
    <CellContainer onPress={onPress} cellWidth={cellWidth} style={style}>
      {stone !== 0 ? (
        <Stone stone={stone} cellWidth={cellWidth}>
          {sequence &&
            (sequence > 0 ? (
              <CustomText size={10} color={stone === 1 ? 'gray/white' : 'gray/black'}>
                {sequence}
              </CustomText>
            ) : (
              sequence === -1 &&
              (pulseLastMove ? (
                <PulsingLastMoveHighlight width={cellWidth / 3.3} />
              ) : (
                <LastMoveHighlight width={cellWidth / 3.3} />
              ))
            ))}
        </Stone>
      ) : showHighlights && pos === `${stoneX}-${stoneY}` ? (
        <Icon name="FocusIcon" color="error/error_color" />
      ) : showHighlights &&
        (pos === '3-3' || pos === '3-11' || pos === '11-3' || pos === '11-11' || pos === '7-7') ? (
        <IndicatePoint />
      ) : null}
    </CellContainer>
  );
};

export default Board;
