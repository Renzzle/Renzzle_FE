import { View } from 'react-native';
import styled from 'styled-components';
import theme from '../../../styles/theme';

export const Preview = styled(View)<{ isLocked: boolean }>`
  width: 90px;
  height: 90px;
  border-radius: 5px;
  align-items: center;
  justify-content: center;

  background-color: ${({ isLocked }) =>
    isLocked ? theme.color['sub_color/beige/c'] : theme.color['sub_color/beige/c']};
`;

export default Preview;
