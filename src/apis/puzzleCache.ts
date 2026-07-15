import apiClient from './interceptor';

export type PuzzleCacheType = 'TRAINING' | 'COMMUNITY';

export interface PuzzleCacheRequest {
  puzzleType: PuzzleCacheType;
  puzzleId: number;
  currentBoardState: string;
}

export interface PuzzleCacheAiResponse {
  position: string | null;
}

export const getPuzzleCacheAiResponse = async ({
  puzzleType,
  puzzleId,
  currentBoardState,
}: PuzzleCacheRequest): Promise<PuzzleCacheAiResponse> => {
  try {
    const response = await apiClient.get('/api/puzzle/cache/ai-response', {
      params: {
        puzzleType,
        puzzleId,
        currentBoardState,
      },
    });

    return response.data.response;
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
