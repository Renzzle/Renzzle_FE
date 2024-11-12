import React from 'react';
import { IndicatorContainer } from './index.styles';
import CustomText from '../../common/CustomText';

interface GameStatusIndicatorProps {
  children?: React.ReactNode;
}

const GameStatusIndicator = ({ children }: GameStatusIndicatorProps) => {
  return (
    <IndicatorContainer>
      <CustomText size={12} color="sub_color/beige/d">
        {children}
      </CustomText>
    </IndicatorContainer>
  );
};

export default GameStatusIndicator;
