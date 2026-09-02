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

export const ProgressBarContainer = styled(View)`
  padding: 10px 20px 0px;
`;

export const StatusHeaderWrapper = styled(View)`
  flex-direction: row;
  align-items: center;
  padding: 32px 20px 0px;
`;

export const CounterSlot = styled(View)<{ align: 'left' | 'right' }>`
  flex: 1;
  flex-direction: row;
  justify-content: ${({ align }) => (align === 'left' ? 'flex-start' : 'flex-end')};
`;

export const CurrentPuzzleWrapper = styled(View)`
  align-items: center;
`;

export const BoardWrapper = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const BottomActionsWrapper = styled(View)`
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 28px 30px;
  z-index: 1;
`;
