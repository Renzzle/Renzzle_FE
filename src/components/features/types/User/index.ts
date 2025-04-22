export interface UserInfo {
  id: number;
  email: string;
  nickname: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  profile: 'RED' | 'ORANGE' | 'GREEN' | 'BLUE' | 'INDIGO' | 'PURPLE' |
    'DARK_RED' | 'DARK_ORANGE' | 'DARK_GREEN' | 'DARK_BLUE' | 'DARK_INDIGO' | 'DARK_PURPLE';
}
