import React from 'react';
import { CustomText, Icon } from '../../common';
import { ButtonContainer } from './index.styles';

interface ReviewButtonProps {
  onPress: () => void;
  children: React.ReactNode;
}

const ReviewButton = ({ onPress, children }: ReviewButtonProps) => {
  return (
    <ButtonContainer onPress={onPress}>
      <CustomText weight="bold" lineHeight="sm" color="main_color/blue_p">
        {children}
      </CustomText>
      <Icon name="ChevronRightCompactIcon" size={18} color="main_color/blue_p" />
    </ButtonContainer>
  );
};
export default ReviewButton;
