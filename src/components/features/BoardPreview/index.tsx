/* eslint-disable react-native/no-inline-styles */

import React from 'react';
import Preview from './index.styles';
import { LockIcon } from '../../common/Icons';
import { BOARD_SIZE, convertLowercaseAlphabetToNumber, convertToReverseNumber } from '../../../utils/utils';
import { Cell } from '../Board';

interface BoardPreviewProps {
  isLocked?: boolean;
  sequence?: string;
}

const parseSequence = (sequence: string) => {
  const moves: { x: number; y: number; stone: 1 | 2 }[] = [];
  let turn = true; // true: black (1), false: white (2)

  let i = 0;
  while (i < sequence.length) {
    const letter = sequence[i];
    const numberMatch = sequence.slice(i + 1).match(/^\d{1,2}/); // Match up to 2-digit numbers
    if (!numberMatch) {break;}

    const number = numberMatch[0];
    const x = convertToReverseNumber(parseInt(number, 10));
    const y = convertLowercaseAlphabetToNumber(letter);

    if (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
      moves.push({ x, y, stone: turn ? 1 : 2 });
      turn = !turn;
    }

    i += 1 + number.length; // Move to the next letter-number pair
  }

  return moves;
};


const BoardPreview = ({ isLocked = false, sequence = '' }: BoardPreviewProps) => {
  const moves = React.useMemo(() => parseSequence(sequence), [sequence]);

  if (isLocked) {
    return (
      <Preview isLocked={true}>
        <LockIcon />
      </Preview>
    );
  }

  return (
    <Preview isLocked={false}>
      {moves.map(({ x, y, stone }, index) => (
        <Cell
          key={index}
          pos={`${x}-${y}`}
          stone={stone}
          cellWidth={6} // Assume a fixed width
          stoneX={x}
          stoneY={y}
          onPress={() => {}}
          showHighlights={false}
          style={{
            position: 'absolute',
            top: x * 6, // Adjust based on cell size
            left: y * 6, // Adjust based on cell size
          }}
        />
      ))}
    </Preview>
  );
};

export default React.memo(BoardPreview);
