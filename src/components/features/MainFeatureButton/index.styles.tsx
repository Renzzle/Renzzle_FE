import styled from 'styled-components';
import { Image, Text, TouchableOpacity } from 'react-native';
import theme, { ColorType } from '../../../styles/theme';


export const ButtonContainer = styled(TouchableOpacity)<{ screenWidth: number, color: ColorType }>`
  width: ${({ screenWidth }) => screenWidth - 20}px;
  height: 160px;
  margin: 0 10px;
  padding: 18px 24px;
  border-radius: 25px;
  background-color: ${(props) => theme.color[props.color]};
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 1);
  elevation: 4;
`;

export const ButtonText = styled(Text)<{ textColor: ColorType }>`
  font-family: "ChangaOne-Regular";
  color: ${(props) => theme.color[props.textColor]};
  font-size: 48px;
`;

export const ButtonImg = styled(Image)`
  width: 65px;
  height: 65px;
  position: absolute;
  right: 15px;
  bottom: 15px;
`;
