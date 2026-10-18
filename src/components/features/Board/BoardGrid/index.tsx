import React, { memo } from 'react';
import { BOARD_SIZE } from '../../../../utils/utils';
import { GridFrame, GridLine } from './index.styles';

interface BoardGridProps {
  boardWidth: number;
  cellWidth: number;
}

const INNER_LINE_WIDTH = 1;
// 바깥 테두리 안쪽 끝이 안쪽 선과 같은 위치에서 0.5만큼 들어오도록 한다
const FRAME_OUTSET = 1.5;

// 칸마다 테두리를 두르는 대신 선을 직접 그려, 판에 들어가는 뷰를 크게 줄인다
const BoardGrid = ({ boardWidth, cellWidth }: BoardGridProps) => {
  const gridSize = (BOARD_SIZE - 1) * cellWidth;
  const start = (boardWidth - gridSize) / 2;
  const innerLineOffsets = Array.from(
    { length: BOARD_SIZE - 2 },
    (_, index) => start + (index + 1) * cellWidth - INNER_LINE_WIDTH / 2,
  );

  return (
    <>
      {innerLineOffsets.map((offset) => (
        <GridLine
          key={`v-${offset}`}
          style={{ left: offset, top: start, width: INNER_LINE_WIDTH, height: gridSize }}
        />
      ))}
      {innerLineOffsets.map((offset) => (
        <GridLine
          key={`h-${offset}`}
          style={{ left: start, top: offset, width: gridSize, height: INNER_LINE_WIDTH }}
        />
      ))}
      <GridFrame
        style={{
          left: start - FRAME_OUTSET,
          top: start - FRAME_OUTSET,
          width: gridSize + FRAME_OUTSET * 2,
          height: gridSize + FRAME_OUTSET * 2,
        }}
      />
    </>
  );
};

export default memo(BoardGrid);
