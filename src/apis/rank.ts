import apiClient from './interceptor';

export const getRatingRanking = async () => {
  try {
    const response = await apiClient.get('/api/rank/rating');

    return response.data.response;
  } catch (error) {
    throw error;
  }
};

export const getCommunityRanking = async () => {
  try {
    const response = await apiClient.get('/api/rank/community');

    return response.data.response;
  } catch (error) {
    throw error;
  }
};

export const startRankingGame = async () => {
  try {
    const response = await apiClient.post('api/rank/game/start');

    return response.data.response;
  } catch (error) {
    throw error;
  }
};

export const submitRankingGameResult = async (isSolved: boolean) => {
  try {
    const response = await apiClient.post('api/rank/game/result', { isSolved });

    return response.data.response;
  } catch (error) {
    throw error;
  }
};

export const finishRankingGame = async () => {
  try {
    const response = await apiClient.post('api/rank/game/end');

    return response.data.response;
  } catch (error) {
    throw error;
  }
};
