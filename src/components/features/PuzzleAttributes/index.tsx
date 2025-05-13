import React from 'react';
import { useTranslation } from 'react-i18next';
import { ColorType } from '../../../styles/theme';
import { IconName } from '../../../assets/icons';
import { AttributeItemWrapper, AttributesWrapper } from './index.styles';
import { CustomText, Icon } from '../../common';

interface PuzzleAttributesProps {
  depth: number;
  winColor: 'BLACK' | 'WHITE';
  isVerified?: boolean;
}

const PuzzleAttributes = ({ depth, winColor, isVerified }: PuzzleAttributesProps) => {
  const { t } = useTranslation();

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

  if (typeof isVerified === 'boolean') {
    metaInfoItems.push({
      text: isVerified ? t('puzzle.certifiedPuzzle') : t('puzzle.notCertifiedPuzzle'),
      iconName: isVerified ? 'AuthenticatedIcon' : 'UnauthenticatedIcon',
      iconColor: isVerified ? 'main_color/blue_p' : 'gray/gray400',
    });
  }

  return (
    <AttributesWrapper>
      {metaInfoItems.map(({ text, iconName, iconColor }, index) => (
        <AttributeItemWrapper key={index}>
          <Icon name={iconName} color={iconColor} />
          <CustomText size={10} lineHeight="sm" color="gray/gray500">
            {text}
          </CustomText>
        </AttributeItemWrapper>
      ))}
    </AttributesWrapper>
  );
};

export default PuzzleAttributes;
