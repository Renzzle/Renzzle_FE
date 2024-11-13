import { TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';

export const HeaderContainer = styled(View)`
  gap: 4px;
  margin: 22px 20px;
`;

export const TitleContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const TitleAndNumber = styled(View)`
  flex-direction: row;
  align-items: center;
  gap: 9px;
`;

export const LikeButton = styled(TouchableOpacity)`
  padding: 3px 0;
`;

export const AuthorContainer = styled(View)`
  
`;
