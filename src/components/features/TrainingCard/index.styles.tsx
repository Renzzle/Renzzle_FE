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

export const MetaInfoWrapper = styled(View)`
  display: flex;
  flex-direction: row;
  gap: 3px;
  align-items: center;
  margin: 3px 0 0;
  flex-wrap: wrap;
`;

export const MetaInfoItemWrapper = styled(View)`
  display: flex;
  flex-direction: row;
  gap: 2px;
  align-items: center;
`;
