import apiClient from './interceptor';

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
    const response = await apiClient.post('/api/puzzle/cache/save', {
      puzzleType,
      puzzleId,
      currentBoardState,
      answerPuzzle,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
