import { View } from 'react-native';
import styled from 'styled-components';
import theme from '../../../styles/theme';

export const Wrapper = styled(View)<{ maxWidth: number }>`
  flex: 1;
  min-height: 100%;
  align-self: center;
  width: 100%;
  max-width: ${({ maxWidth }) => `${maxWidth}px`};
  background-color: ${theme.color['gray/grayBG']};
`;

export const AppBackground = styled(View)`
  flex: 1;
  width: 100%;
  height: 100%;
  background-color: ${theme.color['gray/grayBG']};
`;
