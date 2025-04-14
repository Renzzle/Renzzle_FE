import React from 'react';
import { TagContainer } from './index.styles';
import CustomText from '../CustomText';

interface CustomTagProps {
  children: React.ReactNode;
}

const CustomTag = ({ children }: CustomTagProps) => {
  return (
    <TagContainer>
      <CustomText size={10} weight="bold" lineHeight="sm" color="main_color/yellow_p">
        {children}
      </CustomText>
    </TagContainer>
  );
};

export default CustomTag;
