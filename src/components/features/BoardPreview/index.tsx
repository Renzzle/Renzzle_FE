/* eslint-disable react-native/no-inline-styles */

import React from 'react';
import Preview, { InnerBorder } from './index.styles';
import { Cell } from '../Board';
import { BOARD_SIZE, parseSequence } from '../../../utils/utils';

interface BoardPreviewProps {
  isLocked?: boolean;
  sequence?: string;
  size?: number;
}

const BoardPreview = ({ isLocked = false, sequence = '', size = 90 }: BoardPreviewProps) => {
  const moves = React.useMemo(() => parseSequence(sequence), [sequence]);
  const cellWidth = size / BOARD_SIZE;

  if (isLocked) {
    return <Preview isLocked={true} size={size} />;
  }

  return (
    <Preview isLocked={false} size={size}>
      <InnerBorder size={size * 0.95}>
        {moves.map(({ x, y, stone }, index) => (
          <Cell
            key={index}
            pos={`${x}-${y}`}
            stone={stone}
            cellWidth={cellWidth} // Assume a fixed width
            stoneX={x}
            stoneY={y}
            onPress={() => {}}
            showHighlights={false}
            style={{
              position: 'absolute',
              top: x * cellWidth * 0.94, // Adjust based on cell size
              left: y * cellWidth * 0.94, // Adjust based on cell size
            }}
          />
        ))}
      </InnerBorder>
    </Preview>
  );
};

export default React.memo(BoardPreview);
