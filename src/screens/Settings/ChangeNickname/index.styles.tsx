import { View } from 'react-native';
import styled from 'styled-components';
import theme from '../../../styles/theme';

export const Container = styled(View)`
  background-color: ${theme.color['gray/grayBG']};
  flex: 1;
  position: relative;
`;
