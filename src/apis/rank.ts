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
