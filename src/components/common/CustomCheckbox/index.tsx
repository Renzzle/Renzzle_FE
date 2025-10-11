import React from 'react';
import { StyledCheckbox } from './index.styles';
import Icon from '../Icon';
import CustomText from '../CustomText';

interface CustomCheckboxProps {
  label: string;
  isChecked: boolean;
  onToggle: () => void;
}

const CustomCheckbox = ({ label, isChecked, onToggle }: CustomCheckboxProps) => {
  return (
    <StyledCheckbox onPress={onToggle}>
      <Icon
        name={isChecked ? 'CheckboxMarkedIcon' : 'CheckboxBlankIcon'}
        color={isChecked ? 'main_color/blue_p' : 'gray/gray500'}
        size={24}
      />
      <CustomText size={14} lineHeight="sm" color="gray/gray500">
        {label}
      </CustomText>
    </StyledCheckbox>
  );
};

export default CustomCheckbox;
