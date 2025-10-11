import React from 'react';
import { StyledRadiobutton } from './index.styles';
import Icon from '../../Icon';
import CustomText from '../../CustomText';

interface CustomRadioButtonProps {
  label: string;
  value: string;
  selectedValue: string;
  onSelect: () => void;
}

const CustomRadioButton = ({ label, value, selectedValue, onSelect }: CustomRadioButtonProps) => {
  const isSelected = value === selectedValue;

  return (
    <StyledRadiobutton onPress={onSelect}>
      <Icon
        name={isSelected ? 'RadioboxMarkedIcon' : 'RadioboxBlankIcon'}
        color={isSelected ? 'main_color/blue_p' : 'gray/gray500'}
        size={24}
      />
      <CustomText size={14} lineHeight="sm" color="gray/gray500">
        {label}
      </CustomText>
    </StyledRadiobutton>
  );
};

export default CustomRadioButton;
