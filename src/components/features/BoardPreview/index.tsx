
import React, { useEffect, useState } from 'react';
import Preview from './index.styles';
import { LockIcon } from '../../common/Icons';
import { BOARD_SIZE, convertLowercaseAlphabetToNumber, convertToReverseNumber } from '../../../utils/utils';
import { Cell, StoneType } from '../Board';
import { StoneRow } from '../Board/index.styles';

interface BoardPreviewProps {
  isLocked?: boolean;
  sequence?: string;
}

const BoardPreview = ({ isLocked = false, sequence = '' }: BoardPreviewProps) => {
  const [board, setBoard] = useState<StoneType[][]>(
    Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0))
  );

  useEffect(() => {
    const newBoard = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
    let turn = true; // true: black (1), false: white (2)

    let i = 0;
    while (i < sequence.length) {
      const letter = sequence[i];
      const numberMatch = sequence.slice(i + 1).match(/^\d{1,2}/); // Match up to 2-digit numbers
      if (!numberMatch) {
        console.error(`Invalid sequence format at index ${i}: ${sequence}`);
        break;
      }

      const number = numberMatch[0];
      const x = convertToReverseNumber(parseInt(number, 10));
      const y = convertLowercaseAlphabetToNumber(letter);

      if (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
        newBoard[x][y] = turn ? 1 : 2; // Place black (1) or white (2) stone
        turn = !turn; // Toggle turn
      }
      i += 1 + number.length; // Move to the next letter-number pair
    }

    setBoard(newBoard);
  }, [sequence]);

  return (
    <Preview isLocked={isLocked}>
      {isLocked ? (
        <LockIcon />
      ) : (
        board.map((row, x) => (
          <StoneRow key={x}>
            {row.map((cell, y) => (
              <Cell
                key={`${x}-${y}`}
                pos={`${x}-${y}`}
                stone={cell} // 0: Empty, 1: Black, 2: White
                cellWidth={6}
                stoneX={x}
                stoneY={y}
                onPress={() => {}}
                showHighlights={false}
              />
            ))}
          </StoneRow>
        ))
        // null
      )}
    </Preview>
  );
};

export default BoardPreview;
