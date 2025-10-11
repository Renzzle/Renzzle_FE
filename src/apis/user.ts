import { ApiCallParams } from '../components/common/InfiniteScrollList';
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

export const getLikedPuzzles = async (id?: number | null, size?: number) => {
  const params: Record<string, any> = {};
  if (id != null) {
    params.id = id;
  }
  if (size != null) {
    params.size = size;
  }

  try {
    const response = await apiClient.get('/api/user/like', { params });

    return response.data.response;
  } catch (error) {
    throw error;
  }
};

export const deleteMyPuzzle = async (puzzleId: number) => {
  try {
    const response = await apiClient.delete(`/api/user/${puzzleId}`);

    return response.data.response;
  } catch (error) {
    throw error;
  }
};
