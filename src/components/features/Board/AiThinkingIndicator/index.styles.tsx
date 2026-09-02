import { Animated, View } from 'react-native';
import styled from 'styled-components';
import theme from '../../../../styles/theme';

export const IndicatorSlot = styled(View)`
  position: absolute;
  top: -38px;
  left: 0;
  right: 0;
  align-items: center;
  z-index: 10;
`;

export const ChipContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 999px;
  background-color: rgba(44, 47, 52, 0.88); /* gray/gray800 기반 반투명 */
`;

export const DotsContainer = styled(View)`
  flex-direction: row;
  gap: 3px;
`;

export const Dot = styled(Animated.View)`
  width: 4px;
  height: 4px;
  border-radius: 2px;
  background-color: ${theme.color['gray/white']};
`;
