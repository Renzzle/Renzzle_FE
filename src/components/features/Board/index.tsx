import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  BoardBackground,
  CellContainer,
  IndicatePoint,
  LastMoveHighlight,
  Stone,
  StoneRow,
} from './index.styles';
import useDeviceWidth from '../../../hooks/useDeviceWidth';
import BoardFrameNumber from './BoardFrameNumber';
import BoardGrid from './BoardGrid';
import {
  BOARD_SIZE,
  coordinatesToPosition,
  convertLowercaseAlphabetToNumber,
  convertToLowercaseAlphabet,
  convertToReverseNumber,
  getSequenceDepth,
  positionToCoordinates,
  positionToValue,
  valueToCoordinates,
} from '../../../utils/utils';
import { Animated, Easing, NativeModules } from 'react-native';
import { CustomText, Icon } from '../../common';
import { showBottomToast } from '../../common/Toast/toastMessage';
import { useTranslation } from 'react-i18next';
import {
  getPuzzleCacheNextMoves,
  PuzzleCacheType,
  savePuzzleCache,
} from '../../../apis/puzzleCache';
import useCancellableNativeRequest from '../../../hooks/useCancellableNativeRequest';
import useDelayedVisibility from '../../../hooks/useDelayedVisibility';
import AiThinkingIndicator from './AiThinkingIndicator';
import ResultHighlight, { BoardPoint } from './ResultHighlight';

export type StoneType = 0 | 1 | 2; // 0: Empty, 1: Black, 2: White

// 풀이가 끝난 이유: 어느 쪽이든 오목 완성, 또는 흑의 금수
export type GameEndReason = 'five' | 'forbidden';

type PuzzleAiBenchmarkMode = 'LOCAL_ONLY' | 'CACHE';
type PuzzleAiAnswerSource = 'local-only' | 'cache-hit' | 'cache-miss' | 'cache-fallback';

const PUZZLE_AI_BENCHMARK_MODE = 'CACHE' as PuzzleAiBenchmarkMode;
const IS_AI_BENCHMARK_ENABLED = __DEV__;

// CheckWinJNI 결과: 방금 둔 쪽의 승리(1), 방금 둔 흑의 금수 패배(2), 그 외(0)
type CheckWinResult = 'win' | 'forbidden' | 'none';

const toCheckWinResult = (check: number): CheckWinResult =>
  check === 1 ? 'win' : check === 2 ? 'forbidden' : 'none';

// 네이티브 수순 파서는 형식을 검증하지 않아 잘못된 문자열이 들어가면 보드 범위 밖을 읽어 앱이 종료될 수 있으므로,
// 이 형식(a~o + 1~15의 반복)에 맞는 수순만 네이티브로 보낸다
const VALID_SEQUENCE_PATTERN = /^(?:[a-o](?:1[0-5]|[1-9]))*$/;

const getLastMoveCoordinates = (sequence: string) => {
  const lastMove = sequence.match(/[a-o](?:1[0-5]|[1-9])$/);
  return lastMove ? positionToCoordinates(lastMove[0]) : null;
};

const LINE_DIRECTIONS = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
];

// 마지막 수를 지나며 같은 색 돌이 다섯 개 이상 이어진 줄을 찾는다
const findFiveLine = (sequence: string): BoardPoint[] | null => {
  const stones = new Map<string, number>();
  let last: BoardPoint | null = null;
  let moveIndex = 0;
  for (const move of sequence.match(/[a-o](?:1[0-5]|[1-9])/g) ?? []) {
    const coordinates = positionToCoordinates(move);
    if (coordinates) {
      stones.set(`${coordinates.x}-${coordinates.y}`, moveIndex % 2);
      last = coordinates;
      moveIndex++;
    }
  }
  if (!last) {
    return null;
  }

  const color = stones.get(`${last.x}-${last.y}`);
  for (const [dx, dy] of LINE_DIRECTIONS) {
    const line: BoardPoint[] = [last];
    for (const sign of [-1, 1]) {
      let x = last.x + dx * sign;
      let y = last.y + dy * sign;
      while (stones.get(`${x}-${y}`) === color) {
        line.push({ x, y });
        x += dx * sign;
        y += dy * sign;
      }
    }
    if (line.length >= 5) {
      return line.sort((a, b) => a.x - b.x || a.y - b.y);
    }
  }
  return null;
};

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
  setIsWin?: (isWin: boolean | null, reason?: GameEndReason) => void;
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

  // 풀이가 끝나면 오목 다섯 돌을 강조한다
  showResultHighlight?: boolean;
  // 결과 강조와 함께 판 테두리를 결과 색으로 물들인다
  showResultFrame?: boolean;
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
    showResultHighlight = false,
    showResultFrame = false,
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
  // 금수로 패배한 돌의 위치 (X 표시)
  const [forbiddenMove, setForbiddenMove] = useState<{ x: number; y: number } | null>(null);
  // 오목 완성이나 금수로 게임이 끝나 더 둘 수 없는 상태
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameResult, setGameResult] = useState<{ isWin: boolean; line: BoardPoint[] | null } | null>(
    null,
  );
  const isReviewMode = mode === 'make' && makeMode === 'review';

  const isAiThinkingVisible =
    useDelayedVisibility(mode === 'solve' && isDisabled) && !hideAiIndicator;

  const [history, setHistory] = useState<string[]>([sequence]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Benchmark Ref
  const aiBenchmarkRef = useRef<AiBenchmarkResult | null>(null);

  // Cancellable Request Refs
  const isMountedRef = useRef(true);
  const checkWinRequestIdRef = useRef(0);
  // 착수 결과는 수순이 같으면 항상 같으므로, 선택(첫 번째 탭) 때 미리 판정해 두고 착수 즉시 사용한다
  const checkWinCacheRef = useRef<Map<string, CheckWinResult>>(new Map());

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

  // 사용자 차례의 보드 상태별로 미리 받아둔 (사용자 수 -> AI 응답) 후보 목록
  const nextMovesPrefetchRef = useRef<{
    boardState: string;
    promise: Promise<Map<string, string> | null>;
  } | null>(null);

  const prefetchNextMoves = useCallback(
    (userTurnBoardState: string) => {
      if (!puzzleCache || getPuzzleAiMode() !== 'CACHE') {
        return;
      }

      if (nextMovesPrefetchRef.current?.boardState === userTurnBoardState) {
        return;
      }

      const prefetchStartedAt = IS_AI_BENCHMARK_ENABLED ? Date.now() : 0;
      const promise = getPuzzleCacheNextMoves({
        ...puzzleCache,
        userTurnBoardState,
      })
        .then((candidates) => {
          if (IS_AI_BENCHMARK_ENABLED) {
            console.log('[AiBenchmark] next-moves prefetch:', {
              puzzleType: puzzleCache.puzzleType,
              puzzleId: puzzleCache.puzzleId,
              boardDepth: getSequenceDepth(userTurnBoardState),
              candidateCount: candidates.length,
              ms: Date.now() - prefetchStartedAt,
            });
          }

          return new Map(candidates.map((candidate) => [candidate.userMove, candidate.aiResponse]));
        })
        .catch((error) => {
          console.log('AI next-moves prefetch failed:', error);
          return null;
        });

      nextMovesPrefetchRef.current = { boardState: userTurnBoardState, promise };
    },
    [puzzleCache],
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

      const lastMoveMatch = userSequence.match(/[a-o](?:1[0-5]|[1-9])$/);
      if (!lastMoveMatch) {
        return { answer: null, shouldSave: false };
      }

      const userMove = lastMoveMatch[0];
      const userTurnBoardState = userSequence.slice(0, -userMove.length);

      // 미리 받아둔 목록이 없거나 다른 보드 상태의 것이라면 이 시점에 조회
      prefetchNextMoves(userTurnBoardState);
      const prefetch = nextMovesPrefetchRef.current;
      if (!prefetch || prefetch.boardState !== userTurnBoardState) {
        return { answer: null, shouldSave: false };
      }

      const cacheStartedAt = IS_AI_BENCHMARK_ENABLED ? Date.now() : 0;
      const nextMoves = await prefetch.promise;
      const cacheLookupMs = IS_AI_BENCHMARK_ENABLED ? Date.now() - cacheStartedAt : undefined;

      if (!nextMoves) {
        return { answer: null, shouldSave: false, cacheLookupMs };
      }

      const position = nextMoves.get(userMove) ?? null;
      if (!position) {
        return { answer: null, shouldSave: true, cacheLookupMs, position: null };
      }

      const cachedAnswer = positionToValue(position);

      return { answer: cachedAnswer, shouldSave: false, cacheLookupMs, position };
    },
    [prefetchNextMoves, puzzleCache],
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
    (sequenceToCheck: string): Promise<CheckWinResult | null> => {
      checkWinRequestIdRef.current += 1;
      const requestId = checkWinRequestIdRef.current;

      return new Promise((resolve) => {
        setTimeout(async () => {
          if (!isMountedRef.current || checkWinRequestIdRef.current !== requestId) {
            resolve(null);
            return;
          }

          if (!VALID_SEQUENCE_PATTERN.test(sequenceToCheck)) {
            resolve('none');
            return;
          }

          try {
            const check = await CheckWinJNI.checkWinWrapper(sequenceToCheck);
            if (!isMountedRef.current || checkWinRequestIdRef.current !== requestId) {
              resolve(null);
              return;
            }

            resolve(toCheckWinResult(check));
          } catch (error) {
            if (!isMountedRef.current || checkWinRequestIdRef.current !== requestId) {
              resolve(null);
              return;
            }

            console.log(error);
            showBottomToast('error', t('toast.numberProcessingError'));
            resolve('none');
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
            setIsGameOver(true);
            setGameResult({ isWin: false, line: null });
            setIsWin?.(false);
            setIsLoading?.(false);
            setIsDisabled(false);
            return;
          }

          if (result === 1000) {
            logAiBenchmark('terminal');
            finishAiRequest(requestId);
            setIsGameOver(true);
            setGameResult({ isWin: true, line: null });
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
          const aiResult = await checkWin(newSequence);

          if (aiResult === null || !isActiveAiRequest(requestId)) {
            return;
          }

          if (aiResult === 'win') {
            logAiBenchmark('ai-win');
            finishAiRequest(requestId);
            // 상대가 오목을 완성한 돌도 판에 두어야 어디서 졌는지 보인다
            updateBoard(x, y, aiIsBlackTurn);
            setIsGameOver(true);
            setGameResult({ isWin: false, line: findFiveLine(newSequence) });
            setIsWin?.(false, 'five');
            setIsLoading?.(false);
            setIsDisabled(false);
            return;
          }

          // 다시 사용자 차례가 되었으므로, 다음 수 후보 목록을 미리 받아둔다
          prefetchNextMoves(newSequence);

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
      prefetchNextMoves,
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
      // 차례는 이미 상대에게 넘어갔으므로, 판정을 기다리는 동안에도 다음 수를 두지 못하게 잠근다
      setIsDisabled(true);
      const userResult = checkWinCacheRef.current.get(newSequence) ?? (await checkWin(newSequence));

      if (userResult === null) {
        return;
      }

      // 미리 판정한 결과는 착수 터치를 처리하는 중에 바로 나오므로, 결과(모달)는 터치 처리가 끝난 다음 프레임에 알린다
      const reportResult = (isWin: boolean, reason: GameEndReason) => {
        requestAnimationFrame(() => {
          if (isMountedRef.current) {
            setIsWin?.(isWin, reason);
          }
        });
      };

      if (userResult === 'win') {
        setIsGameOver(true);
        setGameResult({ isWin: true, line: findFiveLine(newSequence) });
        setIsLoading?.(false);
        setIsDisabled(false);
        reportResult(true, 'five');
        return;
      }

      if (userResult === 'forbidden') {
        // 흑이 금수(33, 44, 장목)에 두면 즉시 패배한다. 둔 돌에 X를 표시하고 AI 차례 없이 패배로 처리한다
        setForbiddenMove({ x: stoneX, y: stoneY });
        setIsGameOver(true);
        setGameResult({ isWin: false, line: null });
        setIsLoading?.(false);
        setIsDisabled(false);
        reportResult(false, 'forbidden');
        return;
      }

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

  // 수순의 결과를 미리 판정해 둔다. 실패하면 실제로 필요할 때 다시 판정한다
  const prefetchCheckWin = useCallback(
    (sequenceToCheck: string) => {
      if (
        checkWinCacheRef.current.has(sequenceToCheck) ||
        !VALID_SEQUENCE_PATTERN.test(sequenceToCheck)
      ) {
        return;
      }

      CheckWinJNI.checkWinWrapper(sequenceToCheck)
        .then((check: number) => {
          checkWinCacheRef.current.set(sequenceToCheck, toCheckWinResult(check));
        })
        .catch(() => {});
    },
    [CheckWinJNI],
  );

  const handleCellPress = useCallback(
    (x: number, y: number) => {
      // 오목 완성이나 금수로 게임이 끝난 뒤에는 더 둘 수 없다
      if (isDisabled || isGameOver) {
        return;
      }

      if (stoneX === x && stoneY === y) {
        handlePut();
      } else {
        setStoneX(x);
        setStoneY(y);
        // 선택한 자리에 두었을 때의 결과를 미리 판정해, 착수 즉시 결과(금수 X 등)를 보여준다
        if ((mode === 'solve' || isReviewMode) && board[x][y].stone === 0) {
          prefetchCheckWin(
            localSequence + convertToLowercaseAlphabet(y) + convertToReverseNumber(x).toString(),
          );
        }
      }
    },
    [
      board,
      handlePut,
      isDisabled,
      isGameOver,
      isReviewMode,
      localSequence,
      mode,
      prefetchCheckWin,
      stoneX,
      stoneY,
    ],
  );

  // 칸마다 누르기 함수를 한 번만 만들어 두어야, 판을 다시 그릴 때 바뀐 칸만 새로 그린다
  const handleCellPressRef = useRef(handleCellPress);
  handleCellPressRef.current = handleCellPress;
  const cellPressHandlers = useMemo(
    () =>
      Array.from({ length: BOARD_SIZE }, (_, x) =>
        Array.from({ length: BOARD_SIZE }, (__, y) => () => handleCellPressRef.current(x, y)),
      ),
    [],
  );

  // 검토 모드: 검토 수순의 각 단계를 미리 판정해 두어, 앞뒤로 이동할 때 결과를 바로 보여준다
  useEffect(() => {
    if (!isReviewMode) {
      return;
    }

    let prefix = '';
    (mainSequence.match(/[a-o](?:1[0-5]|[1-9])/g) ?? []).forEach((move) => {
      prefix += move;
      if (prefix.length > problemSequence.length) {
        prefetchCheckWin(prefix);
      }
    });
  }, [isReviewMode, mainSequence, prefetchCheckWin, problemSequence]);

  // 검토 모드: 현재 수순이 이미 끝난 게임이면(오목 완성, 금수) 더 둘 수 없게 하고, 금수면 마지막 돌에 X를 표시한다
  useLayoutEffect(() => {
    if (!isReviewMode) {
      return;
    }

    const applyResult = (result: CheckWinResult) => {
      setIsGameOver(result !== 'none');
      setForbiddenMove(result === 'forbidden' ? getLastMoveCoordinates(localSequence) : null);
    };

    const cachedResult = checkWinCacheRef.current.get(localSequence);
    if (cachedResult) {
      applyResult(cachedResult);
      return;
    }

    let isStale = false;
    applyResult('none');
    checkWin(localSequence).then((result) => {
      if (isStale || result === null) {
        return;
      }
      checkWinCacheRef.current.set(localSequence, result);
      applyResult(result);
    });

    return () => {
      isStale = true;
    };
  }, [checkWin, isReviewMode, localSequence]);

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
    // 풀이 모드에서 새 문제로 바뀌면 이전 문제의 게임 종료 상태와 미리 받아 둔 판정을 지운다
    // (검토 모드는 수순이 바뀔 때마다 다시 초기화되므로, 종료 상태를 현재 수순으로부터 따로 계산한다)
    if (mode === 'solve') {
      setForbiddenMove(null);
      setIsGameOver(false);
      setGameResult(null);
      checkWinCacheRef.current.clear();
    }
  }, [mode, problemSequence, sequence, t]);

  useEffect(() => {
    initializeBoard();
  }, [initializeBoard]);

  // solve 모드 진입 시(사용자 차례) 다음 수 후보 목록을 미리 받아둔다
  useEffect(() => {
    if (mode === 'solve') {
      prefetchNextMoves(sequence);
    }
  }, [mode, prefetchNextMoves, sequence]);

  return (
    <BoardBackground boardWidth={boardWidth}>
      <BoardFrameNumber direction="vertical" />
      <BoardFrameNumber direction="horizontal" />
      <BoardGrid boardWidth={boardWidth} cellWidth={cellWidth} />
      {board.map((row, x) => (
        <StoneRow key={x}>
          {row.map((cell, y) => (
            <Cell
              key={`${x}-${y}`}
              pos={`${x}-${y}`}
              stone={cell.stone}
              cellWidth={cellWidth}
              isSelected={stoneX === x && stoneY === y}
              sequence={cell.moveNumber}
              onPress={cellPressHandlers[x][y]}
              pulseLastMove={isAiThinkingVisible && cell.moveNumber === -1}
              isForbidden={forbiddenMove?.x === x && forbiddenMove?.y === y}
            />
          ))}
        </StoneRow>
      ))}
      {showResultHighlight && gameResult && (
        <ResultHighlight
          boardWidth={boardWidth}
          cellWidth={cellWidth}
          isWin={gameResult.isWin}
          line={gameResult.line}
          showFrame={showResultFrame}
        />
      )}
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
  // 착수하려고 고른 칸
  isSelected?: boolean;
  sequence: number | null;
  onPress: () => void;
  pulseLastMove?: boolean;
  // 금수로 패배한 돌에 X 표시
  isForbidden?: boolean;
}

// 판을 다시 그려도 값이 바뀐 칸만 새로 그리도록 메모이제이션한다
export const Cell = memo(function Cell({
  pos,
  stone,
  cellWidth,
  isSelected = false,
  sequence,
  onPress,
  pulseLastMove = false,
  isForbidden = false,
}: CellProps) {
  return (
    <CellContainer onPress={onPress} cellWidth={cellWidth}>
      {stone !== 0 ? (
        <Stone stone={stone} cellWidth={cellWidth}>
          {isForbidden ? (
            <Icon name="CrossIcon" color="error/error_color" size={cellWidth * 0.9} />
          ) : (
            sequence &&
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
            ))
          )}
        </Stone>
      ) : isSelected ? (
        <Icon name="FocusIcon" color="error/error_color" />
      ) : pos === '3-3' || pos === '3-11' || pos === '11-3' || pos === '11-11' || pos === '7-7' ? (
        <IndicatePoint />
      ) : null}
    </CellContainer>
  );
});

export default Board;
