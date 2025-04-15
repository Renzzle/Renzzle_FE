import React from 'react';
import { ButtonContainer } from './index.styles';
import CustomText from '../../common/CustomText';

interface PutStoneButtonProps {
  onPress: () => void;
  category: 'put' | 'add';
  disabled?: boolean;
}

const CircleButton = ({ onPress, category, disabled = false }: PutStoneButtonProps) => {
  return (
    <ButtonContainer onPress={onPress} disabled={disabled}>
      {category === 'put' && (
        <CustomText size={18} weight="bold" lineHeight="sm" color="gray/white">
          착수
        </CustomText>
      )}
    </ButtonContainer>
  );
};

export default CircleButton;
