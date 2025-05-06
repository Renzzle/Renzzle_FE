import { View } from 'react-native';
import styled from 'styled-components';
import theme from '../../../styles/theme';
import { CustomText } from '../../common';

export const Preview = styled(View)<{ size: number }>`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  border-radius: ${({ size }) => `${size * 0.05}px`};
  border: ${({ size }) => `${size * 0.01}px`} solid ${theme.color['sub_color/beige/d']};
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${theme.color['sub_color/beige/c']};
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

export const SolvedOverlay = styled(View)<{ size: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: ${({ size }) => `${size * 0.99}px`};
  height: ${({ size }) => `${size * 0.99}px`};
  background-color: rgba(0, 0, 0, 0.28);
  justify-content: center;
  align-items: center;
  border-radius: ${({ size }) => `${size * 0.04}px`};
`;

export const SolvedText = styled(CustomText)`
  text-shadow: 1px 1px 1px gray;
`;

export default Preview;
