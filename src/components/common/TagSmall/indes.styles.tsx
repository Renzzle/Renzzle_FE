import { View } from 'react-native';
import styled from 'styled-components';
import theme from '../../../styles/theme';

export const TagContainer = styled(View)`
  background-color: ${theme.color['gray/gray50']};
  padding: 2px 3px 1px;
  border-radius: 2px;
`;
