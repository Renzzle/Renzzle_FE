import { ApiCallParams } from '../components/common/InfiniteScrollList';
import { HTTP_HEADERS } from './constants';
import apiClient from './interceptor';

export const getUser = async () => {
  try {
    const response = await apiClient.get('/api/user');

    return response.data.response;
  } catch (error) {
    throw error;
  }
};

export const getUserPuzzles = async (params: ApiCallParams) => {
  const queryParams: Record<string, any> = {
    size: params.size ?? 10,
  };

  if (params.id !== null && params.id !== undefined) {
    queryParams.id = params.id;
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
