import React from 'react';
import { Container } from './index.styles';
import { RankingResultTheme, ResultVariant } from '../../../types';
import { CustomText, Icon } from '../../common';

interface Props {
  variant: ResultVariant;
  text: string;
  disabled?: boolean;
  onPress?: () => void;
}

const RankingResultButton = ({ variant, text, disabled = false, onPress }: Props) => {
  const selectedVarient = RankingResultTheme[variant];

  return (
    <Container variant={variant} disabled={disabled} onPress={onPress}>
      <Icon name={selectedVarient.iconName} size={24} color={selectedVarient.primary} />
      <CustomText size={14} weight="bold" lineHeight="sm" color={selectedVarient.primary}>
        #{text}
      </CustomText>
    </Container>
  );
};

export default RankingResultButton;
