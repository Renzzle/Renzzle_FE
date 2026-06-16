import React from 'react';
import { CustomText, Icon } from '../../common';
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
      <Icon name="ChevronRightIcon" size={22} color="main_color/blue_p" />
    </ButtonContainer>
  );
};
export default ReviewButton;
