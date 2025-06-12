import { ScrollView, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';
import theme from '../../styles/theme';

export const ScrollContainer = styled(ScrollView)`
  flex: 1;
  display: flex;
  background-color: ${theme.color['gray/grayBGDim']};
`;

export const HomeContainer = styled(View)`
  flex: 1;
  padding: 0 15px 15px;
  display: flex;
  gap: 30px;
`;

export const MainMenuWrapper = styled(View)`
  display: flex;
  gap: 10px;
`;

export const MainMenuButton = styled(TouchableOpacity)<{ backgroundColor: string }>`
  display: flex;
  flex-direction: row;
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-radius: 13px;
`;

export const MainMenuText = styled(View)`
  display: flex;
  flex: 1;
  padding: 18px 18px 18px 0;
  gap: 3px;
`;

export const SubMenuWrapper = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  padding: 10px;
  background-color: ${theme.color['gray/white']};
  border-radius: 13px;
  flex-wrap: wrap;
`;

export const SubMenuButton = styled(TouchableOpacity)`
  display: flex;
  gap: 5px;
  align-items: center;
  padding: 10px;
`;

export const ArticleWrapper = styled(View)`
  display: flex;
  gap: 10px;
  align-items: center;
`;

export const ArticleTitle = styled(View)`
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: center;
`;
