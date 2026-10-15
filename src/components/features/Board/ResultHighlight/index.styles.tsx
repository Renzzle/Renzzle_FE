import { Animated, View } from 'react-native';
import styled from 'styled-components';

export const HighlightLayer = styled(View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const ResultFrame = styled(Animated.View)<{ color: string }>`
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  border-width: 3px;
  border-radius: 8px;
  border-color: ${({ color }) => color};
`;

export const StoneRing = styled(Animated.View)<{ color: string; size: number }>`
  position: absolute;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: ${({ size }) => size / 2}px;
  border-width: 2.5px;
  border-color: ${({ color }) => color};
`;

export const StrikeLine = styled(Animated.View)<{ color: string }>`
  position: absolute;
  height: 3px;
  border-radius: 1.5px;
  opacity: 0.85;
  background-color: ${({ color }) => color};
`;
