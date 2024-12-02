import { HTTP_HEADERS } from './constants';
import { apiClient } from './interceptor';

export const getCommunityPuzzle = async (
  authStore: string,
  size?: number,
  sort?: string,
  id?: number,
) => {
  try {
    const params: Record<string, string | number> = {};
    if (id !== undefined) {params.id = id;}
    if (size !== undefined) {params.size = size;}
    if (sort !== undefined) {params.sort = sort;}

    const response = await apiClient.get('/api/community/puzzle', {
      headers: {
        [HTTP_HEADERS.AUTHORIZATION]: `Bearer ${authStore}`,
      },
      params,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadPuzzle = async (
  authStore: string,
  title: string,
  boardStatus: string,
  depth: number,
  difficulty: string,
  winColor: string,
) => {
  try {
    const response = await apiClient.post(
      '/api/community/puzzle',
      { title, boardStatus, depth, difficulty, winColor },
      {
        headers: {
          [HTTP_HEADERS.AUTHORIZATION]: `Bearer ${authStore}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
