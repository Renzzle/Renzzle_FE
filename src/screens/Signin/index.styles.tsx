import { View } from 'react-native';
import styled from 'styled-components';
import theme from '../../styles/theme';

export const SigninContainer = styled(View)`
  background-color: ${theme.color['gray/grayBG']};
  flex: 1;
`;

export const TextInputContainer = styled(View)`
  gap: 5px;
`;

export const SigninInfoContainer = styled(View)`
  margin: 20px;
  gap: 10px;
`;
