import { View } from 'react-native';
import styled from 'styled-components';
import theme from '../../../styles/theme';

export const Preview = styled(View)<{ isLocked: boolean }>`
  width: 90px;
  height: 90px;
  border-radius: 5px;
  background-color: ${theme.color['sub_color/beige/c']};
  background-color: ${({ isLocked }) =>
    isLocked ? theme.color['sub_color/beige/s'] : theme.color['sub_color/beige/c']
  };
`;

export default Preview;
