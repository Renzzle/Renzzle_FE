import { View } from 'react-native';
import styled from 'styled-components';
import theme from '../../../styles/theme';

export const TagContainer = styled(View)`
  background-color: ${theme.color['sub_color/yellow/bg']};
  padding: 3px 6px;
  border-radius: 4px;
  align-self: flex-start;
`;
