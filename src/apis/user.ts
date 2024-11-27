import { HTTP_HEADERS } from './constants';
import apiClient from './interceptor';

export const getUser = async (authStore: string) => {
  try {
    const response = await apiClient.get('/api/user', {
      headers: {
        [HTTP_HEADERS.AUTHORIZATION]: `Bearer ${authStore}`,
      },
    });

    return response.data.response;
  } catch (error) {
    throw error;
  }
};
