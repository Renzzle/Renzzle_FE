import { TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';

export const HeaderContainer = styled(View)`
  gap: 4px;
  margin: 22px 25px;
`;

export const TopContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const TitleAndNumber = styled(View)`
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  gap: 9px;
`;

export const TitleTextContainer = styled(View)<{ deviceWidth: number }>`
  max-width: ${({ deviceWidth }) => deviceWidth - 140}px;
`;

export const LikeButton = styled(TouchableOpacity)`
  padding: 3px 0;
`;

export const AuthorContainer = styled(View)`
  
`;
