import React from 'react';
import { ColorType } from '../../../styles/theme';
import { useWindowDimensions } from 'react-native';
import { ButtonContainer, ButtonImg, ButtonText } from './index.styles';

interface MainFeatureButtonProps {
  text: string;
  color: ColorType;
  textColor?: ColorType;
  onPress?: () => void;
}

const imageMap: { [key: string]: any } = {
  'Community': require('../../../assets/images/community.png'),
  'AI Puzzle': require('../../../assets/images/ai.png'),
  'Ch. 2': require('../../../assets/images/lesson-green.png'),
};

const MainFeatureButton = ({ text, color, textColor = 'gray/white', onPress}: MainFeatureButtonProps) => {
  const { width } = useWindowDimensions();
  const defaultImg = require('../../../assets/images/lesson.png');
  const imageSource = imageMap[text] || defaultImg;
  return (
    <ButtonContainer buttonWidth={width} color={color} onPress={onPress}>
      <ButtonText textColor={textColor}>{ text }</ButtonText>
      <ButtonImg source={imageSource} />
    </ButtonContainer>
  );
};

export default MainFeatureButton;
