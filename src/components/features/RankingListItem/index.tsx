import React from 'react';
import { CardContainer, NameText, RankText, ScoreText } from './index.styles';
import { Icon } from '../../common';
import { useTranslation } from 'react-i18next';
import { IconName } from '../../../assets/icons';
import { ColorType } from '../../../styles/theme';

interface RankingListItemProps {
  rank: number;
  nickname: string;
  score: number;
  category: 'rating' | 'best';
  isCurrentUser?: boolean;
}

const getIconName = (rank: number, category: 'rating' | 'best'): IconName => {
  const base = category === 'rating' ? 'Orange' : 'Blue';
  const defaultBase = category === 'rating' ? 'Rating' : 'Puzzle';
  switch (rank) {
    case 1:
      return `Ranking1st${base}Icon` as IconName;
    case 2:
      return `Ranking2nd${base}Icon` as IconName;
    case 3:
      return `Ranking3rd${base}Icon` as IconName;
    default:
      return `Ranking${defaultBase}Icon` as IconName;
  }
};

const getIconColor = (category: 'rating' | 'best'): ColorType | undefined => {
  return category === 'rating' ? 'main_color/yellow_s' : 'main_color/blue_p';
};

const RankingListItem = ({
  rank,
  nickname,
  score,
  category,
  isCurrentUser = false,
}: RankingListItemProps) => {
  const { t } = useTranslation();

  const iconName = getIconName(rank, category);
  const iconColor = getIconColor(category);

  return (
    <CardContainer category={category} isCurrentUser={isCurrentUser}>
      <Icon name={iconName} color={iconColor} />
      <RankText size={14} lineHeight="sm" weight="bold">
        {rank}
      </RankText>

      <NameText size={14} lineHeight="sm" numberOfLines={1} ellipsizeMode="tail">
        {nickname}
      </NameText>

      <ScoreText size={14} lineHeight="sm">
        {t('ranking.score', { score: score })}
      </ScoreText>
    </CardContainer>
  );
};

export default RankingListItem;
