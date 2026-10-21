import { Animated, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';

export const ICON_SIZE = 24;
export const RING_SIZE = 36;

export const ActionButtonWrapper = styled(TouchableOpacity)`
  display: flex;
  align-items: center;
  gap: 2px;
  align-self: flex-start;
`;

export const IconArea = styled(View)`
  width: ${ICON_SIZE}px;
  height: ${ICON_SIZE}px;
`;

// 버튼 크기를 그대로 두도록 쿨타임 원은 아이콘 자리 밖으로 걸쳐 그린다
export const RingSlot = styled(Animated.View)`
  position: absolute;
  top: ${(ICON_SIZE - RING_SIZE) / 2}px;
  left: ${(ICON_SIZE - RING_SIZE) / 2}px;
  width: ${RING_SIZE}px;
  height: ${RING_SIZE}px;
`;
