import { TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';
import theme from '../../../styles/theme';

export const CardContainer = styled(TouchableOpacity)<{ cardWidth: number }>`
  width: ${({ cardWidth }) => cardWidth}px;
  display: flex;
  gap: 15px;
  background-color: ${theme.color['gray/white']};
  padding: 15px;
  border-radius: 13px;
`;

export const DescriptionContainer = styled(View)`
  gap: 2px;
`;
