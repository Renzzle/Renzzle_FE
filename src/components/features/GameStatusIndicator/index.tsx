import React from 'react';
import { IndicatorContainer } from './index.styles';
import CustomText from '../../common/CustomText';

export type IndicatorCategoryType =
  | 'AI_MOVE_IN_PROGRESS'
  | 'VALIDATION_TIMEOUT_WARGING'
  | 'AI_VALIDATION_IN_PROGRESS';

const INDICATOR_TEXT = {
  AI_MOVE_IN_PROGRESS: 'AI가 수를 찾고 있습니다...',
  VALIDATION_TIMEOUT_WARGING: '30초 초과 시 검증은 자동 실패됩니다.',
  AI_VALIDATION_IN_PROGRESS: 'AI가 검증중입니다...',
};

interface GameStatusIndicatorProps {
  category?: IndicatorCategoryType;
}

const GameStatusIndicator = ({ category }: GameStatusIndicatorProps) => {
  const text = category ? INDICATOR_TEXT[category] : '';

  return (
    <IndicatorContainer>
      <CustomText size={12} color="sub_color/beige/d" numberOfLines={1}>
        {text}
      </CustomText>
    </IndicatorContainer>
  );
};

export default GameStatusIndicator;
