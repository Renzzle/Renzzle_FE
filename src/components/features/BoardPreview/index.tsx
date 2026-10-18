import React from 'react';
import { StyleSheet, View } from 'react-native';
import Preview, { InnerBorder, SolvedOverlay, SolvedText } from './index.styles';
import { BOARD_SIZE, parseSequence } from '../../../utils/utils';
import { useTranslation } from 'react-i18next';
import theme, { SizeType } from '../../../styles/theme';

interface BoardPreviewProps {
  sequence: string;
  isSolved?: boolean;
  size?: number;
}

// 판 크기에 비해 돌 간격을 조금 좁혀 테두리 안에 들어오게 한다
const STONE_SPACING = 0.94;

const BoardPreview = ({ sequence = '', isSolved = false, size = 90 }: BoardPreviewProps) => {
  const { t } = useTranslation();

  const moves = React.useMemo(() => parseSequence(sequence), [sequence]);
  const cellWidth = size / BOARD_SIZE;
  const stoneSize = cellWidth - 1;

  const sizeTypes: SizeType[] = [8, 10, 12, 14, 16, 18, 20, 22, 52];
  const rawSize = size * 0.13;
  const closestSizeType = sizeTypes.reduce((prev, curr) =>
    Math.abs(curr - rawSize) < Math.abs(prev - rawSize) ? curr : prev,
  );

  // 목록에 여러 개가 함께 그려지므로, 돌마다 누를 수 있는 칸 대신 단순한 원 하나만 그린다
  return (
    <Preview size={size}>
      <InnerBorder size={size * 0.95} pointerEvents="none">
        {moves.map(({ x, y, stone }, index) => (
          <View
            key={index}
            style={[
              styles.stone,
              stone === 1 ? styles.black : styles.white,
              {
                top: x * cellWidth * STONE_SPACING + 0.5,
                left: y * cellWidth * STONE_SPACING + 0.5,
                width: stoneSize,
                height: stoneSize,
                borderRadius: stoneSize / 2,
                borderWidth: cellWidth * 0.025,
              },
            ]}
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

const styles = StyleSheet.create({
  stone: {
    position: 'absolute',
    borderColor: theme.color['gray/gray500'],
  },
  black: {
    backgroundColor: theme.color['gray/black'],
  },
  white: {
    backgroundColor: theme.color['gray/white'],
  },
});

export default React.memo(BoardPreview);
