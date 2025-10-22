import React from 'react';
import { ActionButtonWrapper } from './index.styles';
import { CustomText, Icon } from '../../common';
import { IconName } from '../../../assets/icons';

type PuzzleActionMode = 'showAnswer' | 'retry' | 'giveUp';

interface PuzzleActionButtonProps {
  mode: PuzzleActionMode;
  onPress: () => void;
}

const PuzzleActionButton = ({ mode, onPress }: PuzzleActionButtonProps) => {
  const modeLabel: Record<PuzzleActionMode, string> = {
    showAnswer: '정답열기',
    retry: '새로하기',
    giveUp: '포기하기',
  };

  const modeIcon: Record<PuzzleActionMode, IconName> = {
    showAnswer: 'LightbulbAlertIcon',
    retry: 'RefreshIcon',
    giveUp: 'FlagIcon',
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
