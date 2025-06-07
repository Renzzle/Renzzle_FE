import { TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';
import theme from '../../styles/theme';

export const SigninContainer = styled(View)`
  background-color: ${theme.color['gray/grayBG']};
  flex: 1;
`;

export const SigninWrapper = styled(View)`
  display: flex;
  flex: 1;
  justify-content: center;
  margin-bottom: 68px;
`;

export const LogoWrapper = styled(View)`
  display: flex;
  gap: 10px;
  align-items: center;
`;

export const TextInputContainer = styled(View)`
  margin: 50px 20px 0;
  gap: 15px;
`;

export const SigninInfoContainer = styled(View)`
  margin: 20px;
  gap: 15px;
`;

export const NavigationButton = styled(TouchableOpacity)`
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
`;

export const NavigationWrapper = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin: 15px 50px;
  flex-wrap: wrap;
  gap: 3px;
`;
