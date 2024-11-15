import { View } from 'react-native';
import styled from 'styled-components';
import theme from '../../../styles/theme';

export const SolveContainer = styled(View)`
  flex: 1;
  background-color: ${theme.color['gray/grayBG']};
`;

export const IndicatorContainer = styled(View)`
  margin: 0 10px;
`;
