import { ApiCallParams } from '../components/common/InfiniteScrollList';
import { HTTP_HEADERS } from './constants';
import { apiClient } from './interceptor';

const cleanParams = (params: ApiCallParams): Record<string, any> => {
  return Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== null && value !== undefined),
  );
};

export const getCommunityPuzzles = async (params: ApiCallParams) => {
  try {
    const filteredParams = cleanParams(params);

    // TODO: 서버 수정 후 if문 두개 삭제 !!
    if (params.stone === null || params.stone === undefined) {
      filteredParams.stone = 'BLACK';
    }
    if (params.sort === null || params.sort === undefined) {
      filteredParams.sort = 'LATEST';
    }
    console.log('filteredparams: ', filteredParams);

    const response = await apiClient.get('/api/community/puzzle', { params: filteredParams });

    return response.data.response;
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
      },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
