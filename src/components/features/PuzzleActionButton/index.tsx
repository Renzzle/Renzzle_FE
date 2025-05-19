import React from 'react';
import { ActionButtonWrapper } from './index.styles';
import { CustomText, Icon } from '../../common';
import { IconName } from '../../../assets/icons';

interface PuzzleActionButtonProps {
  mode: 'showAnswer' | 'retry';
  onPress: () => void;
}

const PuzzleActionButton = ({ mode, onPress }: PuzzleActionButtonProps) => {
  const modeLabel: Record<'showAnswer' | 'retry', string> = {
    showAnswer: '정답열기',
    retry: '새로하기',
  };

  const modeIcon: Record<'showAnswer' | 'retry', IconName> = {
    showAnswer: 'LightbulbAlertIcon',
    retry: 'RefreshIcon',
  };

  return (
    <ActionButtonWrapper onPress={onPress}>
      <Icon name={modeIcon[mode]} color="gray/gray500" size={24} />
      <CustomText size={8} lineHeight="sm" color="gray/gray500">
        {modeLabel[mode]}
      </CustomText>
    </ActionButtonWrapper>
  );
};

export default PuzzleActionButton;
