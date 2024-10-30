import styled from 'styled-components';
import { Text } from 'react-native';
import theme from '../../../styles/theme';
import { TextPropsType } from './index.types';

export type StyledTextType = Required<TextPropsType>;
export const StyledText = styled(Text)<StyledTextType>`
  color: ${(props) => theme.color[props.color]};
  font-size: ${(props) => `${props.size}px`};
  font-weight: ${(props) => theme.weight[props.weight]};
  line-height: ${(props) => `${Math.round(theme.lineHeight[props.lineHeight] * props.size)}px`};
`;

export default StyledText;
