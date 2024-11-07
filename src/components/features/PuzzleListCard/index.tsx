import React from 'react';
import { useWindowDimensions, View } from 'react-native';
import { CardBottom, CardContainer, CardInfoContainer, CardTop } from './index.styles';
import BoardPreview from '../BoardPreview';
import CustomText from '../../common/CustomText';
import DividerThin from '../../common/DividerThin';

interface PuzzleListCardProps {
  title: string;
  author: string;
  description: string;
  bottom: () => React.ReactNode;
  isLocked?: boolean;
}

const PuzzleListCard = ({title, author = 'Renzzle', description, bottom, isLocked = false}: PuzzleListCardProps) => {
  const { width } = useWindowDimensions();
  return (
    <CardContainer buttonWidth={width}>
      <CardTop>
        <BoardPreview isLocked={isLocked} />
        <CardInfoContainer>
          <View>
            <CustomText size={20} weight="bold" lineHeight="lg">{title}</CustomText>
            <CustomText size={14} weight="normal" lineHeight="sm">{author}</CustomText>
          </View>
          <CustomText size={10} weight="normal" lineHeight="sm" color="gray/gray500">{description}</CustomText>
        </CardInfoContainer>
      </CardTop>
      <DividerThin />
      <CardBottom>
        {bottom && bottom()}
      </CardBottom>
    </CardContainer>
  );
};

export default PuzzleListCard;