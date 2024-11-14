import React, {useEffect, useState } from 'react';
import GameStatusIndicator from '../GameStatusIndicator';
import { BoardAndPutContainer, BoardBackground, CellContainer, FramContainer, FrameCell, FrameRow, IndicatePoint, PutButtonContainer, Stone, StoneRow } from './index.styles';
import useDeviceWidth from '../../../hooks/useDeviceWidth';
import BoardFrameNumber from './BoardFrameNumber';
import CircleButton from '../CircleButton';
import { AppIcon } from '../../common/Icons';
import theme from '../../../styles/theme';
import { BOARD_SIZE, convertToLowercaseAlphabet, convertToReverseNumber } from '../../../utils/utils';

export type StoneType = 0 | 1 | 2; // 0: Empty, 1: Black, 2: White

const Board = () => {
  const width = useDeviceWidth();
  const boardWidth = width - 20;
  const cellWidth = (boardWidth - 26) / 14;

  const [board, setBoard] = useState<StoneType[][]>(
    Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0))
  );
  const [isBlackTurn, setIsBlackTurn] = useState(true);
  const [stoneX, setStoneX] = useState<number>();
  const [stoneY, setStoneY] = useState<number>();
  const [previewX, setPreviewX] = useState<number | null>();
  const [previewY, setPreviewY] = useState<number | null>();
  const [sequence, setSequence] = useState<string>('');

  const handlePut = () => {
    if (stoneX !== undefined && stoneY !== undefined) {
      if (board[stoneX][stoneY] !== 0) {return;}

      const letter = convertToLowercaseAlphabet(stoneY);
      const number = convertToReverseNumber(stoneX).toString();
      setSequence((prevSequence) => prevSequence + letter + number);

      const newBoard = board.map((row) => [...row]); // copy row
      newBoard[stoneX][stoneY] = isBlackTurn ? 1 : 2;
      setBoard(newBoard);
      setIsBlackTurn(!isBlackTurn);
      setPreviewX(null);
      setPreviewY(null);
    }
  };

  useEffect(() => {
    console.log('sequence: ' + sequence);
  }, [sequence]);

  const handlePlaceStone = (x: number, y: number) => {
    setStoneX(x);
    setStoneY(y);
    setPreviewX(x);
    setPreviewY(y);
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
              <Cell key={`${x}-${y}`} pos={`${x}-${y}`} stone={cell} cellWidth={cellWidth} previewX={previewX} previewY={previewY} onPress={() => handlePlaceStone(x, y)} />
            ))}
          </StoneRow>
        ))}
      </BoardBackground>
      <GameStatusIndicator>{stoneX}, {stoneY}</GameStatusIndicator>
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
  previewX: number | null | undefined;
  previewY: number | null | undefined;
  onPress: () => void;
}

const Cell = ({ pos, stone, cellWidth, previewX, previewY, onPress }: CellProps) => {
  return (
    <CellContainer onPress={onPress} cellWidth={cellWidth}>
      {stone !== 0 ? (
        <Stone stone={stone} cellWidth={cellWidth} />
      ) : (
        (pos === `${previewX}-${previewY}`) ? (
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
