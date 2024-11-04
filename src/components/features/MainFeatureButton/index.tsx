import React from 'react';
import { ColorType } from '../../../styles/theme';
import { useWindowDimensions } from 'react-native';
import { ButtonContainer, ButtonImg, ButtonText } from './index.styles';

interface MainFeatureButtonProps {
  text: string;
  color: ColorType;
  onPress: () => void;
}

const imageMap: { [key: string]: any } = {
  'Community': require('../../../assets/images/Community.png'),
  'AI Puzzle': require('../../../assets/images/AI.png'),
};

const MainFeatureButton = ({ text, color, onPress}: MainFeatureButtonProps) => {
  const { width } = useWindowDimensions();
  const defaultImg = require('../../../assets/images/Lesson.png');
  const imageSource = imageMap[text] || defaultImg;
  return (
    <ButtonContainer buttonWidth={width} color={color} onPress={onPress}>
      <ButtonText>{ text }</ButtonText>
      <ButtonImg source={imageSource} />
    </ButtonContainer>
  );
};

export default MainFeatureButton;
