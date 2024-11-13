import { TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import theme from '../../../styles/theme';

export const ButtonContainer = styled(TouchableOpacity)`
  width: 60px;
  height: 60px;
  align-items: center;
  justify-content: center;
  border-radius: 30px;
  background-color: ${theme.color['sub_color/green/c']};
  elevation: 4;
`;
