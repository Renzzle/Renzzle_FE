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
  /* BoardWrapper(flex: 1)가 화면 전체를 덮으므로, 헤더가 터치를 받으려면 z-index가 필요함 */
  z-index: 1;
`;

export const DescriptionWrapper = styled(View)`
  padding: 0 20px;
`;

export const BoardWrapper = styled(View)`
  flex: 1;
  justify-content: center;
`;

export const BoardStatusWrapper = styled(View)`
  height: 60px;
`;

export const BoardStatsWrapper = styled(BoardStatusWrapper)`
  padding-right: 20px;
  justify-content: flex-end;
`;

export const BoardReactionWrapper = styled(BoardStatusWrapper)`
  padding: 10px 20px 0;
`;
