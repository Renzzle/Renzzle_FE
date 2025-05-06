import React from 'react';
import {
  CardContainer,
  ContentWrapper,
  MetaInfoItemWrapper,
  MetaInfoWrapper,
  StatsItemWrapper,
  StatsWrapper,
  TitleWrapper,
} from './index.styles';
import BoardPreview from '../BoardPreview';
import { CustomText, Icon } from '../../common';
import { useTranslation } from 'react-i18next';
import { IconName } from '../../../assets/icons';
import { ColorType } from '../../../styles/theme';
import { View } from 'react-native';

interface CommunityCardProps {
  title: string;
  sequence: string;
  depth: number;
  winColor: 'BLACK' | 'WHITE';
  isVerified: boolean;
  date: string;
  puzzleId: number;
  views: number;
  solvedCount: number;
  likeCount: number;
  isSolved: boolean;
  onPress: () => void;
  onDelete?: () => void;
}

const CommunityCard = ({
  title,
  sequence,
  depth,
  winColor,
  isVerified,
  date,
  puzzleId,
  views,
  solvedCount,
  likeCount,
  isSolved,
  onPress,
  onDelete,
}: CommunityCardProps) => {
  const { t } = useTranslation();

  const metaInfoItems: { text: string | number; iconName: IconName; iconColor?: ColorType }[] = [];
  const statsItems: { text: string | number; iconName: IconName }[] = [];

  if (depth !== undefined && depth !== null) {
    metaInfoItems.push({
      text: t('puzzle.depth') + ' ' + depth,
      iconName: 'DepthIcon',
      iconColor: 'main_color/yellow_s',
    });
  }

  if (winColor) {
    metaInfoItems.push({
      text: winColor === 'BLACK' ? t('puzzle.blackWin') : t('puzzle.whiteWin'),
      iconName: winColor === 'BLACK' ? 'StoneBlackIcon' : 'StoneWhiteIcon',
      iconColor: winColor === 'BLACK' ? 'gray/black' : 'gray/white',
    });
  }

  if (typeof isVerified === 'boolean') {
    metaInfoItems.push({
      text: isVerified ? t('puzzle.certifiedPuzzle') : t('puzzle.notCertifiedPuzzle'),
      iconName: isVerified ? 'AuthenticatedIcon' : 'UnauthenticatedIcon',
      iconColor: isVerified ? 'main_color/blue_p' : 'gray/gray400',
    });
  }

  const statConfigs = [
    { condition: puzzleId != null, text: puzzleId, iconName: 'HashTagIcon' },
    { condition: solvedCount != null, text: solvedCount, iconName: 'SolvedIcon' },
    { condition: views != null, text: views, iconName: 'ViewIcon' },
    { condition: likeCount != null, text: likeCount, iconName: 'HeartSmallIcon' },
  ] as const;

  statConfigs.forEach(({ condition, text, iconName }) => {
    if (condition) {
      statsItems.push({ text, iconName });
    }
  });

  return (
    <CardContainer onPress={onPress}>
      <BoardPreview sequence={sequence} isSolved={isSolved} />
      <ContentWrapper>
        <View>
          <TitleWrapper showDeleteIcon={onDelete ? true : false}>
            <CustomText size={14} weight="bold">
              {title}
            </CustomText>
            {onDelete && <Icon name="WasteBinIcon" size={15} />}
          </TitleWrapper>
          <MetaInfoWrapper>
            {metaInfoItems.map(({ text, iconName, iconColor }, index) => (
              <MetaInfoItemWrapper key={index}>
                <Icon name={iconName} color={iconColor} />
                <CustomText size={10} lineHeight="sm" color="gray/gray500">
                  {text}
                </CustomText>
              </MetaInfoItemWrapper>
            ))}
          </MetaInfoWrapper>
          <CustomText size={8} lineHeight="sm" color="gray/gray500">
            {date}
          </CustomText>
        </View>

        <StatsWrapper>
          {statsItems.map(({ text, iconName }, index) => (
            <StatsItemWrapper key={index}>
              <Icon name={iconName} color="gray/gray500" />
              <CustomText size={8} lineHeight="sm" color="gray/gray500">
                {text}
              </CustomText>
            </StatsItemWrapper>
          ))}
        </StatsWrapper>
      </ContentWrapper>
    </CardContainer>
  );
};

export default CommunityCard;
