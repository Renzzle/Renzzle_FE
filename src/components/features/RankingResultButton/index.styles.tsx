import { TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import { RankingResultTheme, ResultVariant } from '../../../types';
import theme from '../../../styles/theme';

export const Container = styled(TouchableOpacity)<{ variant: ResultVariant }>`
  flex-direction: row;
  gap: 5px;
  align-items: center;
  background-color: ${({ variant }) => theme.color[RankingResultTheme[variant].secondary]};
  border-radius: 12px;
  align-self: flex-start;
  padding-right: 8px;
`;
