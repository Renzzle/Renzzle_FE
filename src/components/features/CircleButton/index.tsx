import React from 'react';
import { ButtonContainer } from './index.styles';
import CustomText from '../../common/CustomText';
import { PlusIcon } from '../../common/Icons';

interface PutStoneButtonProps {
  onPress: () => void;
  category: 'put' | 'add';
}

const CircleButton = ({ onPress, category }: PutStoneButtonProps) => {
  return (
    <ButtonContainer onPress={onPress}>
      {category === 'put' && <CustomText size={18} weight="bold" lineHeight="sm" color="gray/white">착수</CustomText>}
      {category === 'add' && <PlusIcon />}
    </ButtonContainer>
  );
};

export default CircleButton;
