import React from 'react';
import { StyledText } from './index.styles';
import { TextPropsType } from './index.types';

export default function CustomText({
  children,
  color = 'gray/gray900',
  size = 16,
  weight = 'normal',
  lineHeight = 'md',
  numberOfLines,
  ...props
}: TextPropsType) {
  return (
    <StyledText
      color={color}
      size={size}
      weight={weight}
      lineHeight={lineHeight}
      numberOfLines={numberOfLines}
      {...props}
    >
      {children}
    </StyledText>
  );
}
