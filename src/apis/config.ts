import apiClient from './interceptor';

export const getAppData = async () => {
  try {
    const response = await apiClient.get('/api/app-data');

    return response.data.response;
  } catch (error) {
    throw error;
  }
};
