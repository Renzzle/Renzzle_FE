import { ElementType } from 'react';
import { ColorType, LineHeightType, SizeType, WeightType } from '../../../styles/theme';

export interface TextPropsType {
  children: React.ReactNode;
  color?: ColorType;
  size?: SizeType;
  weight?: WeightType;
  lineHeight?: LineHeightType;
  numberOfLines?: number;
  as?: ElementType;
}
