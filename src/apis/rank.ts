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

export const getMyRating = async () => {
  try {
    const response = await apiClient.get('/api/rank/rating/my', { skipLoadingIndicator: true });

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

export const submitRankingGameResult = async (isSolved: boolean, boardStatus?: string) => {
  try {
    // 실패하면 게임 화면이 직접 모달을 띄운다
    const response = await apiClient.post(
      'api/rank/game/result',
      { isSolved, boardStatus },
      { skipNetworkErrorModal: true },
    );

    return response.data.response;
  } catch (error) {
    throw error;
  }
};

export const finishRankingGame = async () => {
  try {
    // 실패하면 게임 화면이 직접 모달을 띄운다
    const response = await apiClient.post('api/rank/game/end', undefined, {
      skipNetworkErrorModal: true,
    });

    return response.data.response;
  } catch (error) {
    throw error;
  }
};

export const getRankGameArchive = async () => {
  try {
    const response = await apiClient.get('/api/rank/game/archive');

    return response.data.response;
  } catch (error) {
    throw error;
  }
};
