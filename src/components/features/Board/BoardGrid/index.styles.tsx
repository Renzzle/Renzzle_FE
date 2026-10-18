import { View } from 'react-native';
import styled from 'styled-components';
import theme from '../../../../styles/theme';

export const GridLine = styled(View)`
  position: absolute;
  background-color: ${theme.color['gray/gray500']};
`;

export const GridFrame = styled(View)`
  position: absolute;
  border-width: 2px;
  border-color: ${theme.color['gray/gray500']};
`;
