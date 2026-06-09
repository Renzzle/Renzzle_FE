import React from 'react';
import { CustomText } from '../../common';
import { ButtonContainer } from './index.styles';

interface ReviewButtonProps {
  onPress: () => void;
}

const ReviewButton = ({ onPress }: ReviewButtonProps) => {
  return (
    <ButtonContainer onPress={onPress}>
      <CustomText weight="bold" lineHeight="sm" color="main_color/blue_p">
        검토하기
      </CustomText>
    </ButtonContainer>
  );
};
export default ReviewButton;
