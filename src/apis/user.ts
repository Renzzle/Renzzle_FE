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

export const getUserPuzzles = async (id: number | null, size: number) => {
  const params: Record<string, any> = { size };
  if (id !== null) {
    params.id = id;
  }

  try {
    const response = await apiClient.get('/api/user/puzzle', { params });

    return response.data.response;
  } catch (error) {
    throw error;
  }
};

export const getLikedPuzzles = async (id: number | null, size: number) => {
  const params: Record<string, any> = { size };
  if (id !== null) {
    params.id = id;
  }

  try {
    const response = await apiClient.get('/api/user/like', { params });

    return response.data.response;
  } catch (error) {
    throw error;
  }
};

export const updateLike = async (authStore: string, puzzleId: number) => {
  try {
    const response = await apiClient.post(
      '/api/user/like',
      { puzzleId },
      {
        headers: {
          [HTTP_HEADERS.AUTHORIZATION]: `Bearer ${authStore}`,
        },
      },
    );

    console.log('like api:' + response.data.response);

    return response.data.response;
  } catch (error) {
    throw error;
  }
};

export const getLikePuzzle = async (authStore: string, size?: number, id?: number) => {
  try {
    const params: Record<string, string | number> = {};
    if (id !== undefined) {
      params.id = id;
    }
    if (size !== undefined) {
      params.size = size;
    }

    const response = await apiClient.get('/api/user/like', {
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
