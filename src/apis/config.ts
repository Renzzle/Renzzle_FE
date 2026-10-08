import apiClient from './interceptor';

export interface AppDataItem {
  tag: string;
  value: string;
}

export const getAppData = async (): Promise<AppDataItem[]> => {
  try {
    const response = await apiClient.get('/api/app-data');

    return response.data.response ?? [];
  } catch (error) {
    throw error;
  }
};
