import React from 'react';
import { ButtonContainer } from './index.styles';

interface PutStoneButtonProps {
  onPress: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

const CircleButton = ({ onPress, disabled = false, children }: PutStoneButtonProps) => {
  return (
    <ButtonContainer onPress={onPress} disabled={disabled}>
      {children}
    </ButtonContainer>
  );
};

export default CircleButton;
