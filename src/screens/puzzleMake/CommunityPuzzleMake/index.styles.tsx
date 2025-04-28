import { View } from 'react-native';
import styled from 'styled-components';
import theme from '../../../styles/theme';

export const MakeContainer = styled(View)`
  flex: 1;
  background-color: ${theme.color['gray/grayBG']};
`;

export const TextInputContainer = styled(View)`
  margin: 35px 25px;
`;
