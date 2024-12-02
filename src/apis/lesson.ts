import { HTTP_HEADERS } from './constants';
import apiClient from './interceptor';

export const getLessonPuzzle = async (
  authStore: string,
  chapter: number,
  size?: number,
  page?: number,
) => {
  try {
    const params: Record<string, string | number> = {};
    if (size !== undefined) {params.size = size;}
    if (page !== undefined) {params.page = page;}

    const response = await apiClient.get(`/api/lesson/${chapter}`, {
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
