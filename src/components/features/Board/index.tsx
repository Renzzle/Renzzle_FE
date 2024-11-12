import React, { useState } from 'react';
import { View } from 'react-native';
import GameStatusIndicator from '../GameStatusIndicator';
import { BoardBackground, CellContainer, FramContainer, FrameCell, FrameRow, IndicatePoint, Stone, StoneRow } from './index.styles';
import useDeviceWidth from '../../../hooks/useDeviceWidth';
import BoardFrameNumber from './BoardFrameNumber';

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

  const handlePress = (x: number, y: number) => {
    if (board[x][y] !== 0) {return;}

    const newBoard = board.map((row) => [...row]); // copy row
    newBoard[x][y] = isBlackTurn ? 1 : 2;
    setBoard(newBoard);
    setIsBlackTurn(!isBlackTurn);
    setXIdx(x);
    setYIdx(y);
  };

  return (
    <View>
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
              <Cell key={`${x}-${y}`} pos={`${x}-${y}`} stone={cell} cellWidth={cellWidth} onPress={() => handlePress(x, y)} />
            ))}
          </StoneRow>
        ))}
      </BoardBackground>
      <GameStatusIndicator>{xIdx}, {yIdx}</GameStatusIndicator>
    </View>
  );
};

interface CellProps {
  pos: string;
  stone: StoneType;
  cellWidth: number;
  onPress: () => void;
}

const Cell = ({ pos, stone, cellWidth, onPress }: CellProps) => {
  return (
    <CellContainer onPress={onPress} cellWidth={cellWidth}>
      {stone !== 0 ? (
        <Stone stone={stone} cellWidth={cellWidth} />
      ) : (
        (pos === '3-3' || pos === '3-11' || pos === '11-3' || pos === '11-11' || pos === '7-7') && (
          <IndicatePoint />
        )
      )}
    </CellContainer>
  );
};

export default Board;
