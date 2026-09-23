import { NoticeItem, NoticeLanguage, PersonalNoticeResponse } from '../types';
import apiClient from './interceptor';

export const getPublicNotices = async (lang: NoticeLanguage): Promise<NoticeItem[]> => {
  try {
    const response = await apiClient.post(`/api/notice/public?langCode=${lang}`);

    return response.data.response;
  } catch (error) {
    throw error;
  }
};

interface GetPersonalNoticeParams {
  lang: NoticeLanguage;
  platform: 'ios' | 'android';
  version: string;
}

export const getPersonalNotice = async ({
  lang,
  platform,
  version,
}: GetPersonalNoticeParams): Promise<PersonalNoticeResponse> => {
  try {
    const response = await apiClient.post('/api/notice/personal', undefined, {
      params: { langCode: lang, platform, version },
    });

    return response.data.response;
  } catch (error) {
    throw error;
  }
};
