import { View } from 'react-native';
import styled from 'styled-components';
import theme from '../../styles/theme';

export const Container = styled(View)`
  flex: 1;
  background-color: ${theme.color['gray/grayBG']};
  position: relative;
`;

export const HeaderWrapper = styled(View)`
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

export const BoardWrapper = styled(View)`
  flex: 1;
  justify-content: center;
`;
