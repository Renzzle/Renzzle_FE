/* eslint-disable react-hooks/exhaustive-deps */
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
  BoardBackground,
  CellContainer,
  FramContainer,
  FrameCell,
  FrameRow,
  IndicatePoint,
  LastMoveHighlight,
  LoadingWrapper,
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
import { ActivityIndicator, NativeModules, ViewStyle } from 'react-native';
import { CustomText, Icon } from '../../common';
import theme from '../../../styles/theme';
import { showBottomToast } from '../../common/Toast/toastMessage';
import { useTranslation } from 'react-i18next';
import {
  getPuzzleCacheAiResponse,
  PuzzleCacheType,
  savePuzzleCache,
} from '../../../apis/puzzleCache';

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
}

const createEmptyBoard = (): CellType[][] => {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => ({
      stone: 0, // 비어있음
      moveNumber: null, // 순서없음
    })),
  );
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

  const [aiAnswer, setAiAnswer] = useState<number>();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [localSequence, setLocalSequence] = useState(sequence);

  const [history, setHistory] = useState<string[]>([sequence]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const aiBenchmarkRef = useRef<AiBenchmarkResult | null>(null);

  useImperativeHandle(ref, () => ({
    undo: () => {
      if (mode !== 'make') {
        return;
      }

      if (makeMode === 'create') {
        if (currentIndex > 0) {
          setCurrentIndex(currentIndex - 1);
        }
      } else if (makeMode === 'review') {
        // 현재 시퀀스가 문제 시퀀스보다 길 때만 undo 가능
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
        // 현재 시퀀스가 메인 시퀀스보다 짧고, 메인 시퀀스의 일부일 때만 redo 가능
        if (localSequence.length < mainSequence.length && mainSequence.startsWith(localSequence)) {
          // 다음 수를 메인 시퀀스에서 가져와 추가
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
  }));

  const updateBoard = (x: number, y: number) => {
    // copy board
    const newBoard: CellType[][] = board.map((row) => row.map((cell) => ({ ...cell })));

    // 기존 마지막 수 표시 제거
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (newBoard[i][j].moveNumber === -1) {
          newBoard[i][j].moveNumber = null;
        }
      }
    }

    // 새 돌 추가 및 마지막 수 표시
    newBoard[x][y] = {
      stone: isBlackTurn ? 1 : 2,
      moveNumber: -1,
    };

    setBoard(newBoard);
  };

  const addToSequence = (x: number, y: number) => {
    const letter = convertToLowercaseAlphabet(y);
    const number = convertToReverseNumber(x).toString();
    const updatedSequence = localSequence + letter + number;

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
  };

  const handlePut = async () => {
    if (stoneX !== undefined && stoneY !== undefined && stoneX !== null && stoneY !== null) {
      if (board[stoneX][stoneY].stone !== 0) {
        return;
      }

      const newSequence = addToSequence(stoneX, stoneY);
      updateBoard(stoneX, stoneY);
      setIsBlackTurn(!isBlackTurn);
      setStoneX(null);
      setStoneY(null);

      if (mode === 'solve') {
        if (await checkWin(newSequence)) {
          setIsWin?.(true);
          setIsLoading?.(false);
          setIsDisabled(false);
          return;
        }

        setIsDisabled(true);
        setIsLoading?.(true);
        await handleAiTurn(newSequence);
      }
    }
  };

  const handleCellPress = (x: number, y: number) => {
    if (isDisabled) {
      return;
    }
    if (stoneX === x && stoneY === y) {
      handlePut();
    } else {
      setStoneX(x);
      setStoneY(y);
    }
  };

  const getCachedAiAnswer = async (
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
  };

  const saveAiAnswerCache = (userSequence: string, aiResult: number) => {
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
  };

  const logAiBenchmark = (result: 'move-applied' | 'ai-win' | 'terminal') => {
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
  };

  const handleAiTurn = async (userSequence: string) => {
    setTimeout(async () => {
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

        if (cachedAnswer !== null) {
          if (IS_AI_BENCHMARK_ENABLED) {
            aiBenchmarkRef.current = {
              mode: aiMode,
              source: 'cache-hit',
              turnStartedAt,
              boardDepth: getSequenceDepth(userSequence),
              puzzleType: puzzleCache?.puzzleType,
              puzzleId: puzzleCache?.puzzleId,
              cacheLookupMs,
              answerReadyMs: Date.now() - turnStartedAt,
              aiAnswer: cachedAnswer,
              position,
            };
          }
          setAiAnswer(cachedAnswer);
          return;
        }

        const source =
          aiMode === 'LOCAL_ONLY' ? 'local-only' : shouldSave ? 'cache-miss' : 'cache-fallback';

        const localAiStartedAt = IS_AI_BENCHMARK_ENABLED ? Date.now() : 0;
        const result = await UserAgainstActionJNI.calculateSomethingWrapper(userSequence);
        if (IS_AI_BENCHMARK_ENABLED) {
          aiBenchmarkRef.current = {
            mode: aiMode,
            source,
            turnStartedAt,
            boardDepth: getSequenceDepth(userSequence),
            puzzleType: puzzleCache?.puzzleType,
            puzzleId: puzzleCache?.puzzleId,
            cacheLookupMs,
            localAiMs: Date.now() - localAiStartedAt,
            answerReadyMs: Date.now() - turnStartedAt,
            aiAnswer: result,
            position,
          };
        }

        if (result === -1) {
          logAiBenchmark('terminal');
          setIsWin?.(false);
          setIsLoading?.(false);
          setIsDisabled(false);
        }
        if (result === 1000) {
          logAiBenchmark('terminal');
          setIsWin?.(true);
          setIsLoading?.(false);
          setIsDisabled(false);
        }
        if (shouldSave && result !== -1 && result !== 1000) {
          saveAiAnswerCache(userSequence, result);
        }
        setAiAnswer(result);
      } catch (error) {
        showBottomToast('error', t('toast.aiCalculationFailed'));
        setIsLoading?.(false);
        setIsDisabled(false);
      }
    }, 0);
  };

  const checkWin = (sequenceToCheck: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        try {
          const check = await CheckWinJNI.checkWinWrapper(sequenceToCheck);
          resolve(check === 1);
        } catch (error) {
          console.log(error);
          showBottomToast('error', t('toast.numberProcessingError'));
          resolve(false);
        }
      }, 0);
    });
  };

  useEffect(() => {
    const processAiAnswer = async () => {
      if (aiAnswer !== null && aiAnswer !== undefined) {
        if (aiAnswer === 1000 || aiAnswer === -1) {
          setIsDisabled(false);
          setIsLoading?.(false);
          return;
        }

        const coordinates = valueToCoordinates(aiAnswer);
        if (!coordinates) {
          return;
        }

        const { x, y } = coordinates;
        const newSequence = addToSequence(x, y);
        if (await checkWin(newSequence)) {
          logAiBenchmark('ai-win');
          setIsWin?.(false);
          setIsLoading?.(false);
          setIsDisabled(false);
          return;
        }

        updateBoard(x, y);
        setIsBlackTurn(!isBlackTurn);
        setIsDisabled(false);
        setIsLoading?.(false);
        logAiBenchmark('move-applied');
      }
    };

    processAiAnswer();
  }, [aiAnswer]);

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

  const initializeBoard = () => {
    const newBoard = createEmptyBoard();
    let turn = true;
    const problemSequenceLength = problemSequence ? getSequenceDepth(problemSequence) : 0;

    let moveIndex = 0;
    let i = 0;
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
      }
      i += 1 + number.length;
    }

    setLocalSequence(sequence);
    setBoard(newBoard);
    setIsBlackTurn(turn);
  };

  useEffect(() => {
    initializeBoard();
  }, [sequence]);

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
            />
          ))}
        </StoneRow>
      ))}
      {isDisabled && (
        <LoadingWrapper>
          <ActivityIndicator color={theme.color['main_color/yellow_p']} />
        </LoadingWrapper>
      )}
    </BoardBackground>
  );
});

interface CellProps {
  pos: string;
  stone: StoneType;
  cellWidth: number;
  stoneX: number | null | undefined;
  stoneY: number | null | undefined;
  sequence: number | null;
  onPress: () => void;
  showHighlights?: boolean;
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
              sequence === -1 && <LastMoveHighlight width={cellWidth / 3.3} />
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
