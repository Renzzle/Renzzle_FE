import { ElementType } from 'react';
import { ColorType, LineHeightType, SizeType, WeightType } from '../../../styles/theme';
import { TextProps } from 'react-native';

export interface TextPropsType extends TextProps {
  children: React.ReactNode;
  color?: ColorType;
  size?: SizeType;
  weight?: WeightType;
  lineHeight?: LineHeightType;
  numberOfLines?: number;
  as?: ElementType;
}
