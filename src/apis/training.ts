import apiClient from './interceptor';

export const getPack = async (difficulty: string, lang: string) => {
  const params: Record<string, any> = { difficulty };
  if (lang !== null) {
    params.lang = lang;
  }

  try {
    const response = await apiClient.get('/api/training/pack', { params });

    return response.data.response;
  } catch (error) {
    throw error;
  }
};

export const getTrainingPuzzles = async (packId: number) => {
  try {
    const response = await apiClient.get(`/api/training/puzzle/${packId}`);

    return response.data.response;
  } catch (error) {
    throw error;
  }
};

export const solveTrainingPuzzle = async (puzzleId: number) => {
  try {
    const response = await apiClient.post(`/api/training/puzzle/${puzzleId}/solve`);

    return response.data.response;
  } catch (error) {
    throw error;
  }
};
