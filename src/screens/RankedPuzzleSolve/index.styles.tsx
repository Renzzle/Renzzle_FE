import { ScrollView, View } from 'react-native';
import styled from 'styled-components';
import theme from '../../styles/theme';

export const Container = styled(View)`
  flex: 1;
  background-color: ${theme.color['gray/grayBG']};
  position: relative;
`;

export const ProgressBarContainer = styled(View)`
  padding: 10px 20px 0px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
`;

export const HorizontalScrollContainer = styled(ScrollView).attrs({
  contentContainerStyle: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    minHeight: 80,
  },
})`
  flex-grow: 0;
`;

export const RankingResultButtonWrapper = styled(View)`
  flex-direction: row;
  gap: 7px;
  padding: 0 20px;
`;

export const BoardWrapper = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const BoardFooterWrapper = styled(View)`
  gap: 20px;
  min-height: 80px;
`;
