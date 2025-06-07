import { View } from 'react-native';
import styled from 'styled-components';

export const ButtonWrapper = styled(View)<{ background: string; size: number }>`
  background-color: ${({ background }) => background};
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  border-radius: ${({ size }) => size * 0.175 + 'px'};
  display: flex;
  align-items: center;
  justify-content: center;
`;
