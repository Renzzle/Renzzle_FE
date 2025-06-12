export const menuThemeMap = {
  trainingPuzzle: {
    titleKey: 'home.trainingPuzzle',
    background: 'sub_color/indigo/bg',
    iconColor: 'main_color/blue_p',
    iconName: 'TrainingIcon',
    route: 'TrainingPacks',
  },
  communityPuzzle: {
    titleKey: 'home.communityPuzzle',
    background: 'sub_color/orange/bg',
    iconColor: 'main_color/yellow_s',
    iconName: 'CommunityIcon',
    route: 'CommunityPuzzles',
  },
  rankingPuzzle: {
    titleKey: 'home.rankingPuzzle',
    background: 'sub_color/yellow/bg',
    iconColor: 'main_color/yellow_p',
    iconName: 'LightningIcon',
    route: 'RankedPuzzleSolve',
  },
  ranking: {
    titleKey: 'common.ranking',
    background: 'sub_color/green/bg',
    iconColor: 'sub_color/green/p',
    iconName: 'RankingIcon',
    route: 'Ranking',
  },
  myPuzzle: {
    titleKey: 'common.myPuzzle',
    background: 'sub_color/beige/bg',
    iconColor: 'sub_color/beige/p',
    iconName: 'ArchiveIcon',
    route: 'MyPuzzles',
  },
  likes: {
    titleKey: 'common.likes',
    background: 'sub_color/red/bg',
    iconColor: 'sub_color/red/p',
    iconName: 'HeartMediumIcon',
    route: 'LikedPuzzles',
  },
  notice: {
    titleKey: 'common.notice',
    background: 'sub_color/blue/bg',
    iconColor: 'sub_color/blue/p',
    iconName: 'NoticeIcon',
    route: 'Home',
  },
  settings: {
    titleKey: 'common.settings',
    background: 'gray/gray100',
    iconColor: 'gray/gray400',
    iconName: 'SettingIcon',
    route: 'Home',
  },
  signup: {
    titleKey: 'auth.signup',
    background: 'sub_color/indigo/bg',
    iconColor: 'main_color/blue_p',
    iconName: 'LogoIcon',
    route: null,
  },
  home: {
    titleKey: 'common.appName',
    background: 'sub_color/indigo/bg',
    iconColor: 'main_color/blue_p',
    iconName: 'LogoIcon',
    route: null,
  },
} as const;

export type MenuType = keyof typeof menuThemeMap;
