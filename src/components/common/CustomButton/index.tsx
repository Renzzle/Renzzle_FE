import React from 'react';
import { StyledPrimaryButton, StyledSecondaryButton } from './index.styles';
import CustomText from '../CustomText';
import { ActivityIndicator } from 'react-native';
import theme from '../../../styles/theme';

interface ButtonPropsType {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  category?: 'primary' | 'secondary';
}

const CustomButton = ({
  children,
  onPress = () => {},
  disabled = false,
  loading = false,
  category = 'primary',
}: ButtonPropsType) => {
  const content = loading ? (
    <ActivityIndicator color={theme.color['gray/gray400']} />
  ) : (
    <CustomText
      weight="bold"
      lineHeight="sm"
      color={
        disabled ? 'gray/gray400' : category === 'primary' ? 'gray/white' : 'main_color/blue_p'
      }>
      {children}
    </CustomText>
  );

  if (category === 'primary') {
    return (
      <StyledPrimaryButton onPress={onPress} disabled={disabled || loading}>
        {content}
      </StyledPrimaryButton>
    );
  }
  return (
    <StyledSecondaryButton onPress={onPress} disabled={disabled || loading}>
      {content}
    </StyledSecondaryButton>
  );
};

export default CustomButton;
