import { View } from 'react-native';
import styled from 'styled-components';
import theme, { ColorType } from '../../../styles/theme';

export const TagContainer = styled(View)<{ backColor: ColorType }>`
  background-color: ${({ backColor }) => theme.color[backColor]};
  padding: 3px 6px;
  border-radius: 4px;
  align-self: flex-start;
`;
