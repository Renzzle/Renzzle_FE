import { NoticeItem, NoticeLanguage } from '../types';
import apiClient from './interceptor';

export const getPublicNotices = async (lang: NoticeLanguage): Promise<NoticeItem[]> => {
  try {
    const response = await apiClient.post(`/api/notice/public?langCode=${lang}`);

    return response.data.response;
  } catch (error) {
    throw error;
  }
};
