import React from 'react';
import { TagContainer } from './indes.styles';
import CustomText from '../CustomText';

interface TagSmallProps {
  children: React.ReactNode;
}

const TagSmall = ({ children }: TagSmallProps) => {
  return (
    <TagContainer>
      <CustomText size={10} weight="bold" lineHeight="sm" color="gray/gray400">
        {children}
      </CustomText>
    </TagContainer>
  );
};

export default TagSmall;
