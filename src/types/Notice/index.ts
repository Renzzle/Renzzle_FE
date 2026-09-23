export type NoticeLanguage = 'KO' | 'EN' | 'JP';

export interface NoticeItem {
  title: string;
  context: string;
  createdAt: string;
  expiredAt: string;
}

export interface PersonalNoticeItem {
  context: string;
}

export type PersonalNoticeDescription = 'context' | 'update' | 'system-check';

export interface PersonalNoticeResponse {
  description?: PersonalNoticeDescription;
  descrpition?: PersonalNoticeDescription;
  notice?: PersonalNoticeItem[];
  version?: string;
}
