import { View } from 'react-native';
import styled from 'styled-components';
import theme from '../../../styles/theme';

export const Preview = styled(View)<{ isLocked: boolean; size: number }>`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  border-radius: ${({ size }) => `${size * 0.05}px`};
  border: ${({ size }) => `${size * 0.01}px`} solid ${theme.color['sub_color/beige/d']};
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ isLocked }) =>
    isLocked ? theme.color['sub_color/beige/c'] : theme.color['sub_color/beige/c']};
`;

export const InnerBorder = styled(View)<{ size: number }>`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  border-radius: ${({ size }) => `${size * 0.03}px`};
  border: ${({ size }) => `${size * 0.005}px`} solid ${theme.color['sub_color/beige/d']};
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default Preview;
