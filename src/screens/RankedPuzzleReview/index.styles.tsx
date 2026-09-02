import { TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';
import theme from '../../styles/theme';
import { RankingResultTheme, ResultVariant } from '../../types';

export const Container = styled(View)`
  flex: 1;
  background-color: ${theme.color['gray/grayBG']};
  position: relative;
  justify-content: center;
  padding-top: 65px;
`;

export const HeaderWrapper = styled(View)`
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  flex-direction: row;
  align-items: flex-start;
  padding: 12px 16px 0;
  /* 뒤에 렌더되는 형제 뷰가 헤더 영역을 덮지 않도록 터치 우선순위 확보 */
  z-index: 1;
`;

export const HeaderSideSlot = styled(View)<{ align: 'left' | 'right' }>`
  flex: 1;
  align-items: ${({ align }) => (align === 'left' ? 'flex-start' : 'flex-end')};
  gap: 6px;
`;

export const CurrentPuzzleWrapper = styled(View)`
  align-items: center;
`;

export const PuzzleNumberRow = styled(View)`
  flex-direction: row;
  align-items: flex-end;
  gap: 3px;
`;

export const ResultBadge = styled(View)<{ variant: ResultVariant }>`
  flex-direction: row;
  align-items: center;
  gap: 4px;
  background-color: ${({ variant }) => theme.color[RankingResultTheme[variant].secondary]};
  border-radius: 12px;
  padding: 4px 10px 4px 8px;
`;

export const BoardWrapper = styled(View)`
  flex: 1;
  justify-content: center;
`;

export const UndoRedoWrapper = styled(View)`
  flex-direction: row;
  width: 100%;
  justify-content: center;
  gap: 60px;
  margin-top: 15px;

  height: 65px;
`;

export const UndoRedoButton = styled(TouchableOpacity)`
  padding: 3px;
`;

export const BottomBarSpacer = styled(View)`
  height: 70px;
`;
