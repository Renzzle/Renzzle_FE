import { IconName } from '../assets/icons';
import { ColorType } from '../styles/theme';
import { ResultVariant } from '../types';

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
