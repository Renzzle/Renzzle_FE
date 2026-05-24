import { TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import theme from '../../../styles/theme';

export const CardContainer = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  background-color: ${theme.color['gray/white']};
  padding: 15px;
  border-radius: 13px;
`;
