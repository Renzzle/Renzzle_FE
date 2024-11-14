import React, {useState } from 'react';
import GameStatusIndicator from '../GameStatusIndicator';
import { BoardAndPutContainer, BoardBackground, CellContainer, FramContainer, FrameCell, FrameRow, IndicatePoint, PutButtonContainer, Stone, StoneRow } from './index.styles';
import useDeviceWidth from '../../../hooks/useDeviceWidth';
import BoardFrameNumber from './BoardFrameNumber';
import CircleButton from '../CircleButton';
import { AppIcon } from '../../common/Icons';
import theme from '../../../styles/theme';

export type StoneType = 0 | 1 | 2; // 0: Empty, 1: Black, 2: White

const BOARD_SIZE = 15;

const Board = () => {
  const [board, setBoard] = useState<StoneType[][]>(
    Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0))
  );
  const [isBlackTurn, setIsBlackTurn] = useState(true);
  const [xIdx, setXIdx] = useState<number>(); // 좌표 디버깅용
  const [yIdx, setYIdx] = useState<number>();
  const width = useDeviceWidth();
  const boardWidth = width - 20;
  const cellWidth = (boardWidth - 26) / 14;
  const [tempX, setTempX] = useState<number | null>();
  const [tempY, setTempY] = useState<number | null>();

  const handlePut = () => {
    if (xIdx !== undefined && yIdx !== undefined) {
      if (board[xIdx][yIdx] !== 0) {return;}

      const newBoard = board.map((row) => [...row]); // copy row
      newBoard[xIdx][yIdx] = isBlackTurn ? 1 : 2;
      setBoard(newBoard);
      setIsBlackTurn(!isBlackTurn);
      setTempX(null);
      setTempY(null);
    }
  };

  const handlePress = (x: number, y: number) => {
    setXIdx(x);
    setYIdx(y);
    setTempX(x);
    setTempY(y);
  };

  return (
    <BoardAndPutContainer>
      <BoardBackground boardWidth={boardWidth}>
        <BoardFrameNumber direction="vertical" />
        <BoardFrameNumber direction="horizontal" />
        <FramContainer>
          {Array.from({ length: BOARD_SIZE - 1 }).map((_, rowIndex) => (
            <FrameRow key={rowIndex}>
              {Array.from({ length: BOARD_SIZE - 1 }).map((__, colIndex) => (
                <FrameCell key={colIndex} cellWidth={cellWidth} />
              ))}
            </FrameRow>
          ))}
        </FramContainer>
        {board.map((row, x) => (
          <StoneRow key={x}>
            {row.map((cell, y) => (
              <Cell key={`${x}-${y}`} pos={`${x}-${y}`} stone={cell} cellWidth={cellWidth} tempX={tempX} tempY={tempY} onPress={() => handlePress(x, y)} />
            ))}
          </StoneRow>
        ))}
      </BoardBackground>
      <GameStatusIndicator>{xIdx}, {yIdx}</GameStatusIndicator>
      <PutButtonContainer>
        <CircleButton onPress={handlePut} category="put" />
      </PutButtonContainer>
    </BoardAndPutContainer>
  );
};

interface CellProps {
  pos: string;
  stone: StoneType;
  cellWidth: number;
  tempX: number | null | undefined;
  tempY: number | null | undefined;
  onPress: () => void;
}

const Cell = ({ pos, stone, cellWidth, tempX, tempY, onPress }: CellProps) => {
  return (
    <CellContainer onPress={onPress} cellWidth={cellWidth}>
      {stone !== 0 ? (
        <Stone stone={stone} cellWidth={cellWidth} />
      ) : (
        (pos === `${tempX}-${tempY}`) ? (
          <AppIcon name="image-filter-center-focus" size={cellWidth} color={theme.color['error/error_color']} />
        ) : (
          (pos === '3-3' || pos === '3-11' || pos === '11-3' || pos === '11-11' || pos === '7-7') && (
            <IndicatePoint />
          ))
      )}
    </CellContainer>
  );
};

export default Board;
