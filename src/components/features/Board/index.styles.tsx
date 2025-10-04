import { TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';
import theme from '../../../styles/theme';
import { StoneType } from '.';

export const BoardAndPutContainer = styled(View)`
  align-items: center;
  gap: 20px;
`;

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

export const LoadingWrapper = styled(View)`
  flex: 1;
  position: absolute;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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
  /* border-color: ${theme.color['main_color/blue_p']}; */
`;

export const Stone = styled(View)<{ stone: StoneType; cellWidth: number }>`
  width: ${({ cellWidth }) => cellWidth - 1}px;
  height: ${({ cellWidth }) => cellWidth - 1}px;
  border-radius: ${({ cellWidth }) => (cellWidth - 1) / 2}px;
  border-color: ${theme.color['gray/gray500']};

  border-width: ${({ cellWidth }) => cellWidth * 0.025}px;

  background-color: ${({ stone }) =>
    stone === 1
      ? theme.color['gray/black']
      : stone === 2
      ? theme.color['gray/white']
      : 'transparent'};
`;

export const IndicatePoint = styled(View)`
  width: 5px;
  height: 5px;
  border-radius: 2.5px;
  background-color: ${theme.color['gray/gray500']};
`;

export const PutButtonContainer = styled(View)``;
