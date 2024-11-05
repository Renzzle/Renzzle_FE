import { TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';
import theme from '../../../styles/theme';

export const CardContainer = styled(TouchableOpacity)<{ buttonWidth: number }>`
  width: ${({ buttonWidth }) => buttonWidth - 20}px;
  padding: 10px;
  margin: 0 10px;
  border-radius: 15px;
  background-color: ${theme.color['gray/white']};
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 1);
  elevation: 4;
`;

export const CardTop = styled(View)`
  flex-direction: row;
  gap: 10px;
  margin-bottom: 10px;
`;

export const CardInfoContainer = styled(View)`
  gap: 5px;
`;

export const CardBottom = styled(View)`
  margin-top: 10px;
`;
