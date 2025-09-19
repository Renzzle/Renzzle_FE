import { IconName } from '../../../assets/icons';
import { ColorType } from '../../../styles/theme';

export interface RatingRanking {
  rank: number;
  nickname: string;
  rating: number;
}

export interface BestRanking {
  rank: number;
  nickname: string;
  score: number;
}

export interface RatingRankingResponse {
  top100: RatingRanking[];
  myRatingRank: RatingRanking;
}

export interface BestRankingResponse {
  top100: BestRanking[];
  myPuzzlerRank: BestRanking;
}

export type ResultVariant = 'success' | 'error' | 'default';

type ResultTheme = {
  primary: ColorType;
  secondary: ColorType;
  iconName: IconName;
};

export const RankingResultTheme: Record<ResultVariant, ResultTheme> = {
  success: {
    primary: 'main_color/blue_p',
    secondary: 'sub_color/indigo/bg',
    iconName: 'CheckIcon',
  },
  error: {
    primary: 'main_color/yellow_p',
    secondary: 'sub_color/yellow/bg',
    iconName: 'CloseIcon',
  },
  default: {
    primary: 'gray/gray400',
    secondary: 'gray/gray100',
    iconName: 'CloseIcon',
  },
};

export interface GameResult {
  variant: ResultVariant;
}

export interface GameOutcome {
  rating: number;
  reward: number;
}
