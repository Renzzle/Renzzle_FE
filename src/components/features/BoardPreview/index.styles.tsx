import { View } from 'react-native';
import styled from 'styled-components';
import theme from '../../../styles/theme';

export const Preview = styled(View)<{ isLocked: boolean; size: number }>`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  border-radius: 5px;
  border: 1px solid ${theme.color['sub_color/beige/d']};
  align-items: center;
  justify-content: center;

  background-color: ${({ isLocked }) =>
    isLocked ? theme.color['sub_color/beige/c'] : theme.color['sub_color/beige/c']};
`;

export const InnerBorder = styled(View)<{ size: number }>`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  border-radius: 3px;
  border: 0.5px solid ${theme.color['sub_color/beige/d']};
  background-color: transparent;
  align-items: center;
  justify-content: center;
`;

export default Preview;
