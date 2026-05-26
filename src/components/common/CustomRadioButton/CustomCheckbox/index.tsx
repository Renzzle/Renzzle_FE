import React from 'react';
import { StyledRadiobutton } from './index.styles';
import Icon from '../../Icon';
import CustomText from '../../CustomText';
import { ColorType } from '../../../../styles/theme';

type CustomRadioButtonVariant = 'default' | 'light';

interface CustomRadioButtonProps {
  label: string;
  value: string;
  selectedValue: string;
  variant?: CustomRadioButtonVariant;
  onSelect: () => void;
}

const textColorMap: Record<CustomRadioButtonVariant, ColorType> = {
  default: 'gray/gray900',
  light: 'gray/gray500',
};

const CustomRadioButton = ({
  label,
  value,
  selectedValue,
  variant = 'default',
  onSelect,
}: CustomRadioButtonProps) => {
  const isSelected = value === selectedValue;

  return (
    <StyledRadiobutton onPress={onSelect}>
      <Icon
        name={isSelected ? 'RadioboxMarkedIcon' : 'RadioboxBlankIcon'}
        color={isSelected ? 'main_color/blue_p' : 'gray/gray500'}
        size={24}
      />
      <CustomText size={14} lineHeight="sm" color={textColorMap[variant]}>
        {label}
      </CustomText>
    </StyledRadiobutton>
  );
};

export default CustomRadioButton;
