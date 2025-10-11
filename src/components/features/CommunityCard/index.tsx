import React from 'react';
import { CardContainer, ContentWrapper, TitleWrapper } from './index.styles';
import BoardPreview from '../BoardPreview';
import { CustomText, Icon } from '../../common';
import { useTranslation } from 'react-i18next';
import { IconName } from '../../../assets/icons';
import { ColorType } from '../../../styles/theme';
import { View } from 'react-native';
import PuzzleStats from '../PuzzleStats';
import PuzzleAttributes from '../PuzzleAttributes';

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

  const datePart = date.split('T')[0];

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
            {onDelete && <Icon onPress={onDelete} name="WasteBinIcon" size={15} />}
          </TitleWrapper>
          <PuzzleAttributes depth={depth} winColor={winColor} isVerified={isVerified} />
          <CustomText size={8} lineHeight="sm" color="gray/gray500">
            {datePart}
          </CustomText>
        </View>

        <PuzzleStats
          puzzleId={puzzleId}
          solvedCount={solvedCount}
          views={views}
          likeCount={likeCount}
          showIconLabel={false}
        />
      </ContentWrapper>
    </CardContainer>
  );
};

export default CommunityCard;
