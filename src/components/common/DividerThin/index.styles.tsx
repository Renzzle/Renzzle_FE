import { View } from 'react-native';
import styled from 'styled-components';
import theme from '../../../styles/theme';

export const Divider = styled(View)`
  width: 100%;
  height: 0;
  border-top-width: 1px;
  border-top-color: ${theme.color['gray/gray100']};
`;

export default Divider;
