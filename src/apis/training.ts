import apiClient from './interceptor';

export const getPack = async (difficulty: string, lang: string) => {
  const params: Record<string, any> = { difficulty };
  if (lang !== null) {
    params.lang = lang;
  }

  try {
    const response = await apiClient.get('/api/training/pack', { params });

    return response.data.response;
  } catch (error) {
    throw error;
  }
};
