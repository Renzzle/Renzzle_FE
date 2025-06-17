import apiClient from './interceptor';

export const getRecommendPack = async (langCode: 'KO' | 'EN' | 'JP') => {
  try {
    const response = await apiClient.get('/api/content/recommend', { params: { langCode } });

    return response.data.response;
  } catch (error) {
    throw error;
  }
};

export const getTrendPuzzles = async () => {
  try {
    const response = await apiClient.get('/api/content/trend');

    return response.data.response?.puzzles;
  } catch (error) {
    throw error;
  }
};
