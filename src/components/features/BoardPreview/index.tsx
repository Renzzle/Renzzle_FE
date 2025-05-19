/* eslint-disable react-native/no-inline-styles */

import React from 'react';
import Preview, { InnerBorder, SolvedOverlay, SolvedText } from './index.styles';
import { Cell } from '../Board';
import { BOARD_SIZE, parseSequence } from '../../../utils/utils';
import { useTranslation } from 'react-i18next';
import { SizeType } from '../../../styles/theme';

interface BoardPreviewProps {
  sequence: string;
  isSolved?: boolean;
  size?: number;
}

const BoardPreview = ({ sequence = '', isSolved = false, size = 90 }: BoardPreviewProps) => {
  const { t } = useTranslation();

  const moves = React.useMemo(() => parseSequence(sequence), [sequence]);
  const cellWidth = size / BOARD_SIZE;

  const sizeTypes: SizeType[] = [8, 10, 12, 14, 16, 18, 20, 22, 52];
  const rawSize = size * 0.13;
  const closestSizeType = sizeTypes.reduce((prev, curr) =>
    Math.abs(curr - rawSize) < Math.abs(prev - rawSize) ? curr : prev,
  );

  return (
    <Preview size={size}>
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

      {isSolved && (
        <SolvedOverlay size={size}>
          <SolvedText size={closestSizeType} weight="bold" lineHeight="sm" color="gray/white">
            {t('puzzle.solved')}
          </SolvedText>
        </SolvedOverlay>
      )}
    </Preview>
  );
};

export default React.memo(BoardPreview);
