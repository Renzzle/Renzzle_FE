import { View } from 'react-native';
import styled from 'styled-components';
import theme from '../../styles/theme';

export const Container = styled(View)`
  flex: 1;
  background-color: ${theme.color['gray/grayBG']};
  position: relative;
`;

export const HeaderWrapper = styled(View)`
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

export const DescriptionWrapper = styled(View)`
  padding: 0 20px;
`;

export const BoardWrapper = styled(View)`
  flex: 1;
  justify-content: center;
  padding-bottom: 24px;
`;

export const BoardStatusWrapper = styled(View)`
  height: 60px;
`;

export const BoardStatsWrapper = styled(BoardStatusWrapper)`
  padding-right: 20px;
  justify-content: flex-end;
`;

export const BoardReactionWrapper = styled(BoardStatusWrapper)`
  padding: 20px 20px 0;
`;
