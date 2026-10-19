import React, { memo } from 'react';
import { PixelRatio } from 'react-native';
import { BOARD_SIZE } from '../../../../utils/utils';
import { GridFrame, GridLine } from './index.styles';

interface BoardGridProps {
  boardWidth: number;
  cellWidth: number;
}

// 위치와 굵기를 기기 픽셀 경계에 맞춰야, 선마다 반올림이 달라 굵기가 들쭉날쭉하지 않는다
const snap = (value: number) => PixelRatio.roundToNearestPixel(value);

const INNER_LINE_WIDTH = snap(1);
const FRAME_WIDTH = snap(2);
// 바깥 테두리 안쪽 끝이 안쪽 선과 같은 위치에서 0.5만큼 들어오도록 한다
const FRAME_OUTSET = 1.5;

// 칸마다 테두리를 두르는 대신 선을 직접 그려, 판에 들어가는 뷰를 크게 줄인다
const BoardGrid = ({ boardWidth, cellWidth }: BoardGridProps) => {
  const gridSize = (BOARD_SIZE - 1) * cellWidth;
  const start = (boardWidth - gridSize) / 2;
  const gridStart = snap(start);
  const gridLength = snap(gridSize);
  const innerLineOffsets = Array.from({ length: BOARD_SIZE - 2 }, (_, index) =>
    snap(start + (index + 1) * cellWidth - INNER_LINE_WIDTH / 2),
  );
  const frameStart = snap(start - FRAME_OUTSET);
  const frameLength = snap(gridSize + FRAME_OUTSET * 2);

  return (
    <>
      {innerLineOffsets.map((offset) => (
        <GridLine
          key={`v-${offset}`}
          style={{ left: offset, top: gridStart, width: INNER_LINE_WIDTH, height: gridLength }}
        />
      ))}
      {innerLineOffsets.map((offset) => (
        <GridLine
          key={`h-${offset}`}
          style={{ left: gridStart, top: offset, width: gridLength, height: INNER_LINE_WIDTH }}
        />
      ))}
      <GridFrame
        style={{
          left: frameStart,
          top: frameStart,
          width: frameLength,
          height: frameLength,
          borderWidth: FRAME_WIDTH,
        }}
      />
    </>
  );
};

export default memo(BoardGrid);
