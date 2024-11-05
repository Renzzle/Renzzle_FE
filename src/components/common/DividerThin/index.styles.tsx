import { View } from 'react-native';
import styled from 'styled-components';
import theme from '../../../styles/theme';

export const Divider = styled(View)`
  height: 0;
  border-top: 1px ${theme.color['gray/gray100']};
`;

export default Divider;
