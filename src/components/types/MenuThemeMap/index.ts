export const menuThemeMap = {
  trainingPuzzle: {
    titleKey: 'home.trainingPuzzle',
    background: 'sub_color/indigo/bg',
    iconColor: 'main_color/blue_p',
    iconName: 'TrainingIcon',
  },
  communityPuzzle: {
    titleKey: 'home.communityPuzzle',
    background: 'sub_color/orange/bg',
    iconColor: 'main_color/yellow_s',
    iconName: 'CommunityIcon',
  },
  rankingPuzzle: {
    titleKey: 'home.rankingPuzzle',
    background: 'sub_color/yellow/bg',
    iconColor: 'sub_color/yellow/p',
    iconName: 'LightningIcon',
  },
  ranking: {
    titleKey: 'common.ranking',
    background: 'sub_color/green/bg',
    iconColor: 'sub_color/green/p',
    iconName: 'RankingIcon',
  },
  myPuzzle: {
    titleKey: 'common.myPuzzle',
    background: 'sub_color/beige/bg',
    iconColor: 'sub_color/beige/p',
    iconName: 'ArchiveIcon',
  },
  likes: {
    titleKey: 'common.likes',
    background: 'sub_color/red/bg',
    iconColor: 'sub_color/red/p',
    iconName: 'HeartMediumIcon',
  },
  notice: {
    titleKey: 'common.notice',
    background: 'sub_color/blue/bg',
    iconColor: 'sub_color/blue/p',
    iconName: 'NoticeIcon',
  },
  settings: {
    titleKey: 'common.settings',
    background: 'gray/gray100',
    iconColor: 'gray/gray400',
    iconName: 'SettingIcon',
  },
} as const;

export type MenuType = keyof typeof menuThemeMap;
