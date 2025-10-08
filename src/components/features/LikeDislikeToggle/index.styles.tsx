import { TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';
import theme from '../../../styles/theme';

export const Container = styled(View)`
  background-color: ${theme.color['gray/gray50']};
  border-radius: 13px;
  flex-direction: row;
  align-self: flex-start;
  align-items: center;
`;

export const Button = styled(TouchableOpacity)`
  flex-direction: row;
  padding: 7px 10px;
  gap: 10px;
  align-items: center;
`;

export const LikeButton = styled(Button)``;

export const DislikeButton = styled(Button)``;

export const VerticalDivider = styled(View)`
  width: 1px;
  height: 13px;
  background-color: ${theme.color['gray/gray500']};
`;
