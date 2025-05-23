import React from 'react';
import { StyledPrimaryButton, StyledSecondaryButton } from './index.styles';
import CustomText from '../CustomText';

interface ButtonPropsType {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  category?: 'primary' | 'secondary';
}

const CustomButton = ({
  children,
  onPress = () => {},
  disabled = false,
  category = 'primary',
}: ButtonPropsType) => {
  if (category === 'primary') {
    return (
      <StyledPrimaryButton onPress={onPress} disabled={disabled}>
        <CustomText weight="bold" lineHeight="sm" color={disabled ? 'gray/gray400' : 'gray/white'}>
          {children}
        </CustomText>
      </StyledPrimaryButton>
    );
  }
  if (category === 'secondary') {
    return (
      <StyledSecondaryButton onPress={onPress} disabled={disabled}>
        <CustomText
          weight="bold"
          lineHeight="sm"
          color={disabled ? 'gray/gray400' : 'main_color/blue_p'}>
          {children}
        </CustomText>
      </StyledSecondaryButton>
    );
  }
};

export default CustomButton;
