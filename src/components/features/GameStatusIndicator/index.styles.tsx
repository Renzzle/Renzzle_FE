import { View } from 'react-native';
import styled from 'styled-components';
import theme from '../../../styles/theme';

export const IndicatorContainer = styled(View)`
  padding: 9px 10px;
  border-radius: 5px;
  background-color: ${theme.color['sub_color/beige/bg']};
  align-items: center;
`;
