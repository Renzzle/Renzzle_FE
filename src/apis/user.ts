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

export const updateLike = async (
  authStore: string,
  puzzleId: number,
) => {
  try {
    const response = await apiClient.post(
      '/api/user/like',
      { puzzleId },
      {
        headers: {
          [HTTP_HEADERS.AUTHORIZATION]: `Bearer ${authStore}`,
        },
      }
    );

    return response.data.response;
  } catch (error) {
    throw error;
  }
};
