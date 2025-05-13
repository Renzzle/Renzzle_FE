import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconName } from '../../../assets/icons';
import { StatsItemWrapper, StatsWrapper } from './index.styles';
import { CustomText, Icon } from '../../common';

interface PuzzleStatsProps {
  puzzleId: number;
  solvedCount: number;
  views: number;
  likeCount: number;
  showIconLabel?: boolean;
}

const PuzzleStats = ({
  puzzleId,
  solvedCount,
  views,
  likeCount,
  showIconLabel = false,
}: PuzzleStatsProps) => {
  const { t } = useTranslation();

  const statsItems: { text: string | number; iconName: IconName; iconLabel: String | null }[] = [];
  const statConfigs = [
    {
      condition: puzzleId != null,
      text: puzzleId,
      iconName: 'HashTagIcon',
      iconLabel: null,
    },
    {
      condition: solvedCount != null,
      text: solvedCount,
      iconName: 'SolvedIcon',
      iconLabel: t('puzzle.solvedCount'),
    },
    {
      condition: views != null,
      text: views,
      iconName: 'ViewIcon',
      iconLabel: t('puzzle.views'),
    },
    {
      condition: likeCount != null,
      text: likeCount,
      iconName: 'HeartSmallIcon',
      iconLabel: t('common.likes'),
    },
  ] as const;

  statConfigs.forEach(({ condition, text, iconName, iconLabel }) => {
    if (condition) {
      statsItems.push({ text, iconName, iconLabel });
    }
  });

  return (
    <StatsWrapper>
      {statsItems.map(({ text, iconName, iconLabel }, index) => (
        <StatsItemWrapper key={index}>
          <Icon name={iconName} color="gray/gray500" />
          <CustomText size={8} lineHeight="sm" color="gray/gray500">
            {showIconLabel && iconLabel != null && ` ${iconLabel} `}
            {text}
          </CustomText>
        </StatsItemWrapper>
      ))}
    </StatsWrapper>
  );
};

export default PuzzleStats;
