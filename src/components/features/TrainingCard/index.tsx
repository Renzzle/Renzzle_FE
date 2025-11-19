import React from 'react';
import { CardContainer, DescriptionContainer } from './index.styles';
import BoardPreview from '../BoardPreview';
import { CustomText } from '../../common';
import { IconName } from '../../../assets/icons';
import { useTranslation } from 'react-i18next';
import { ColorType } from '../../../styles/theme';
import PuzzleAttributes from '../PuzzleAttributes';
import useDeviceWidth from '../../../hooks/useDeviceWidth';

interface TrainingCardProps {
  title: string;
  sequence: string;
  depth: number;
  winColor: 'BLACK' | 'WHITE';
  isSolved: boolean;
  onPress: () => void;
}

const TrainingCard = ({
  title,
  sequence,
  depth,
  winColor,
  isSolved,
  onPress,
}: TrainingCardProps) => {
  const { t } = useTranslation();

  const screenWidth = useDeviceWidth();
  const cardMargin = 15;
  const cardPadding = 15;
  const cardGap = 10;
  const cardWidth = (screenWidth - cardMargin * 2 - cardGap) / 2;
  const previewWidth = cardWidth - cardPadding * 2;

  const metaInfoItems: { text: string | number; iconName: IconName; iconColor?: ColorType }[] = [];

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

  return (
    <CardContainer onPress={onPress} cardWidth={cardWidth}>
      <BoardPreview sequence={sequence} isSolved={isSolved} size={previewWidth} />
      <DescriptionContainer>
        <CustomText size={14} weight="bold">
          #{title}
        </CustomText>
        <PuzzleAttributes depth={depth} winColor={winColor} />
      </DescriptionContainer>
    </CardContainer>
  );
};

export default TrainingCard;
