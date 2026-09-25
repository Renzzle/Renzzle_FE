import { View } from 'react-native';
import styled from 'styled-components';
import theme from '../../../styles/theme';

export const CellWrapper = styled(View)<{ cellWidth: number }>`
  width: ${({ cellWidth }) => cellWidth}px;
  height: ${({ cellWidth }) => cellWidth}px;
`;

export const CellOverlay = styled(View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
`;

export const TargetRing = styled(View)<{ size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: ${({ size }) => size / 2}px;
  border-width: 2px;
  border-color: ${theme.color['main_color/blue_p']};
`;
