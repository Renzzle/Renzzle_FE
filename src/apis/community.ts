import { ApiCallParams } from '../components/common/InfiniteScrollList';
import { apiClient } from './interceptor';

const cleanParams = (params: ApiCallParams): Record<string, any> => {
  return Object.fromEntries(Object.entries(params).filter(([_, value]) => value != null));
};

export const getCommunityPuzzles = async (params: ApiCallParams) => {
  try {
    const filteredParams = cleanParams(params);

    const response = await apiClient.get('/api/community/puzzle', { params: filteredParams });

    return response.data.response;
  } catch (error) {
    throw error;
  }
};

export const getCommunityPuzzle = async (puzzleId: number) => {
  try {
    const response = await apiClient.get(`/api/community/puzzle/${puzzleId}`);

    return response.data.response;
  } catch (error) {
    throw error;
  }
};

export const updateLike = async (puzzleId: number) => {
  try {
    console.log('puzzleId: ', puzzleId);
    const response = await apiClient.post(`/api/community/puzzle/${puzzleId}/like`);

    return response.data.response;
  } catch (error) {
    throw error;
  }
};

export const updateDislike = async (puzzleId: number) => {
  try {
    const response = await apiClient.post(`/api/community/puzzle/${puzzleId}/dislike`);

    return response.data.response;
  } catch (error) {
    throw error;
  }
};

export const solveCommunityPuzzle = async (puzzleId: number) => {
  try {
    const response = await apiClient.post(`/api/community/puzzle/${puzzleId}/solve`);

    return response.data.response;
  } catch (error) {
    throw error;
  }
};

export const openCommunityAnswer = async (puzzleId: number) => {
  try {
    const response = await apiClient.post(`/api/community/puzzle/${puzzleId}/answer`);

    return response.data.response;
  } catch (error) {
    throw error;
  }
};

export const uploadPuzzle = async (
  boardStatus: string,
  answer: string,
  depth: number,
  description: string,
  winColor: string,
  isVerified: boolean,
) => {
  try {
    const response = await apiClient.post('/api/community/puzzle', {
      boardStatus,
      answer,
      depth,
      description,
      winColor,
      isVerified,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
