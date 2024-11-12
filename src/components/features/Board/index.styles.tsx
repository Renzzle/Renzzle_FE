import { TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';
import theme from '../../../styles/theme';
import { StoneType } from '.';

export const BoardBackground = styled(View)<{ boardWidth: number }>`
  width: ${({ boardWidth }) => boardWidth}px;
  position: relative;
  margin: 10px;
  aspect-ratio: 1;
  border-radius: 5px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${theme.color['sub_color/beige/c']};
`;

export const FramContainer = styled(View)`
  position: absolute;
  border-width: 1.5px;
  border-color: ${theme.color['gray/gray500']};
`;

export const FrameRow = styled(View)`
  flex-direction: row;
`;

export const FrameCell = styled(View)<{ cellWidth: number }>`
  width: ${({ cellWidth }) => cellWidth}px;
  height: ${({ cellWidth }) => cellWidth}px;
  justify-content: center;
  align-items: center;
  border-width: 0.5px;
  border-color: ${theme.color['gray/gray500']};
`;

export const StoneRow = styled(View)`
  flex-direction: row;
`;

export const CellContainer = styled(TouchableOpacity)<{ cellWidth: number }>`
  width: ${({ cellWidth }) => cellWidth}px;
  height: ${({ cellWidth }) => cellWidth}px;
  justify-content: center;
  align-items: center;
  /* border-width: 0.5px; */
  /* border-color: ${theme.color['main_color/green']}; */
`;

export const Stone = styled(View)<{ stone: StoneType, cellWidth: number }>`
  width: ${({ cellWidth }) => cellWidth - 1}px;
  height: ${({ cellWidth }) => cellWidth - 1}px;
  border-radius: ${({ cellWidth }) => (cellWidth - 1) / 2}px;
  border-width: 1px;
  border-color: ${theme.color['gray/gray500']};

  background-color: ${({ stone }) =>
    stone === 1 ? theme.color['gray/black'] : stone === 2 ? theme.color['gray/white'] : 'transparent'
  };
`;

export const IndicatePoint = styled(View)`
  width: 5px;
  height: 5px;
  border-radius: 2.5px;
  background-color: ${theme.color['gray/gray500']};
`;

// export const FrameNum = styled(Text)`
//   font-family: 'Pretendard-Medium';
//   font-size: 8px;
//   color: ${theme.color['gray/gray500']};
// `;

// export const VerticalNum = styled(FrameNum)<{ boardWidth: number }>`
//   height: ${({ boardWidth }) => boardWidth}px;
//   width: 10px;
//   position: absolute;
//   display: flex;
//   flex-direction: column;
//   align-items: end;
//   top: 2px;
//   left: 1px;
// `;

// export const HorizontalNum = styled(FrameNum)<{ boardWidth: number }>`
//   width: ${({ boardWidth }) => boardWidth}px;
//   position: absolute;
//   bottom: 2px;
//   left: 2px;
// `;
