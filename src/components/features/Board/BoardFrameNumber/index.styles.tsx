import styled from 'styled-components';
import { View } from 'react-native';

export const VerticalNum = styled(View)<{ boardWidth: number }>`
  height: ${({ boardWidth }) => boardWidth - 10}px;
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  top: 6px;
  left: -1px;
`;

export const HorizontalNum = styled(View)<{ boardWidth: number }>`
  width: ${({ boardWidth }) => boardWidth - 15}px;
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  bottom: 0;
  left: 8px;
`;
