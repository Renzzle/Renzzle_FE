import apiClient from './interceptor';

// 캐시를 못 받으면 기기에서 AI를 계산하므로, 오래 기다리지 않고 바로 넘어간다
const NEXT_MOVES_TIMEOUT_MS = 5 * 1000;

export type PuzzleCacheType = 'TRAINING' | 'COMMUNITY';

export interface PuzzleCacheRequest {
  puzzleType: PuzzleCacheType;
  puzzleId: number;
  currentBoardState: string;
}

export interface NextMoveCandidate {
  userMove: string;
  aiResponse: string;
}

export interface NextMovesRequest {
  puzzleType: PuzzleCacheType;
  puzzleId: number;
  userTurnBoardState: string;
}

export const getPuzzleCacheNextMoves = async ({
  puzzleType,
  puzzleId,
  userTurnBoardState,
}: NextMovesRequest): Promise<NextMoveCandidate[]> => {
  try {
    const response = await apiClient.get('/api/puzzle/cache/next-moves', {
      params: {
        puzzleType,
        puzzleId,
        userTurnBoardState,
      },
      timeout: NEXT_MOVES_TIMEOUT_MS,
      skipNetworkErrorModal: true,
    });

    return response.data.response ?? [];
  } catch (error) {
    throw error;
  }
};

export const savePuzzleCache = async ({
  puzzleType,
  puzzleId,
  currentBoardState,
  answerPuzzle,
}: PuzzleCacheRequest & { answerPuzzle: string }) => {
  try {
    const response = await apiClient.post(
      '/api/puzzle/cache/save',
      {
        puzzleType,
        puzzleId,
        currentBoardState,
        answerPuzzle,
      },
      { skipNetworkErrorModal: true },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
