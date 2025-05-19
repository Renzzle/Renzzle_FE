import React from 'react';
import { TagContainer } from './index.styles';
import CustomText from '../CustomText';
import { ColorType } from '../../../styles/theme';

export type CustomTagVariant = 'default' | 'highlight';

interface CustomTagProps {
  children: React.ReactNode;
  variant?: CustomTagVariant;
}

const CustomTag = ({ children, variant }: CustomTagProps) => {
  const pointColorMap: Record<CustomTagVariant, ColorType> = {
    default: 'gray/gray500',
    highlight: 'main_color/yellow_p',
  };
  const backColorMap: Record<CustomTagVariant, ColorType> = {
    default: 'gray/gray50',
    highlight: 'sub_color/yellow/bg',
  };

  const pointColor = pointColorMap[variant ?? 'default'];
  const backColor = backColorMap[variant ?? 'default'];

  return (
    <TagContainer backColor={backColor}>
      <CustomText size={10} weight="bold" lineHeight="sm" color={pointColor}>
        {children}
      </CustomText>
    </TagContainer>
  );
};

export default CustomTag;
