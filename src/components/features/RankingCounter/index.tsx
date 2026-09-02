import React from 'react';
import { Container } from './index.styles';
import { RankingResultTheme, ResultVariant } from '../../../types';
import { CustomText, Icon } from '../../common';

interface Props {
  variant: ResultVariant;
  count: number;
}

const RankingCounter = ({ variant, count }: Props) => {
  const selectedVariant = RankingResultTheme[variant];

  return (
    <Container variant={variant}>
      <Icon name={selectedVariant.iconName} size={24} color={selectedVariant.primary} />
      <CustomText size={14} weight="bold" lineHeight="sm" color={selectedVariant.primary}>
        {count}
      </CustomText>
    </Container>
  );
};

export default RankingCounter;
