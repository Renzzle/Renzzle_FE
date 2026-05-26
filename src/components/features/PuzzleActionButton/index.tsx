import React from 'react';
import { ActionButtonWrapper } from './index.styles';
import { CustomText, Icon } from '../../common';
import { IconName } from '../../../assets/icons';
import { useTranslation } from 'react-i18next';

type PuzzleActionMode = 'showAnswer' | 'retry' | 'giveUp';

interface PuzzleActionButtonProps {
  mode: PuzzleActionMode;
  disabled?: boolean;
  onPress: () => void;
}

const PuzzleActionButton = ({ mode, disabled = false, onPress }: PuzzleActionButtonProps) => {
  const { t } = useTranslation();

  const modeLabel: Record<PuzzleActionMode, string> = {
    showAnswer: t('puzzle.viewAnswer'),
    retry: t('puzzle.retry'),
    giveUp: t('puzzle.resign'),
  };

  const modeIcon: Record<PuzzleActionMode, IconName> = {
    showAnswer: 'LightbulbAlertIcon',
    retry: 'RefreshIcon',
    giveUp: 'FlagIcon',
  };

  const color = disabled ? 'gray/gray200' : 'gray/gray500';

  return (
    <ActionButtonWrapper onPress={onPress} disabled={!!disabled}>
      <Icon name={modeIcon[mode]} color={color} size={24} />
      <CustomText size={8} lineHeight="sm" color={color}>
        {modeLabel[mode]}
      </CustomText>
    </ActionButtonWrapper>
  );
};

export default PuzzleActionButton;
