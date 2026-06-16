import React from 'react';
import { CustomText } from '../../common';
import { ButtonContainer } from './index.styles';
import { useTranslation } from 'react-i18next';

interface ReviewButtonProps {
  onPress: () => void;
}

const ReviewButton = ({ onPress }: ReviewButtonProps) => {
  const { t } = useTranslation();
  return (
    <ButtonContainer onPress={onPress}>
      <CustomText weight="bold" lineHeight="sm" color="main_color/blue_p">
        {t('puzzle.review')}
      </CustomText>
    </ButtonContainer>
  );
};
export default ReviewButton;
