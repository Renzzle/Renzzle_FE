import { View } from 'react-native';
import styled from 'styled-components';
import theme from '../../../styles/theme';

export const TagContainer = styled(View)`
  background-color: ${theme.color['gray/gray50']};
  padding: 1px 3px 2px;
  border-radius: 2px;
`;
