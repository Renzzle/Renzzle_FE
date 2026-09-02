export type NoticeLanguage = 'KO' | 'EN' | 'JP';

export interface NoticeItem {
  title: string;
  context: string;
  createdAt: string;
  expiredAt: string;
}
