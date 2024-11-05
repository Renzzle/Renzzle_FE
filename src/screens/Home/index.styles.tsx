import { TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';
import theme from '../../styles/theme';

export const MenuButton = styled(TouchableOpacity)`
  margin-right: 15px;
`;

export const ButtonContainer = styled(View)`
  background-color: ${theme.color['gray/grayBG']};
  gap: 10px;
  flex: 1;
  justify-content: center;
`;
