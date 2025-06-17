import { View } from 'react-native';
import styled from 'styled-components';
import theme from '../../styles/theme';

export const Container = styled(View)`
  padding: 0 15px;
  background-color: ${theme.color['gray/grayBGDim']};
  flex: 1;
`;

export const ActiveTabContainer = styled(View)`
  padding-top: 15px;
`;
