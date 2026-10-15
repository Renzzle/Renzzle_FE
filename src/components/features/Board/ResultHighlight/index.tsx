import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import theme from '../../../../styles/theme';
import { BOARD_SIZE } from '../../../../utils/utils';
import { HighlightLayer, ResultFrame, StoneRing, StrikeLine } from './index.styles';

export interface BoardPoint {
  x: number;
  y: number;
}

const RING_STAGGER_MS = 60;
const STRIKE_DELAY_MS = 220;

interface ResultHighlightProps {
  boardWidth: number;
  cellWidth: number;
  isWin: boolean;
  line: BoardPoint[] | null;
  showFrame: boolean;
}

const ResultHighlight = ({
  boardWidth,
  cellWidth,
  isWin,
  line,
  showFrame,
}: ResultHighlightProps) => {
  const color = theme.color[isWin ? 'main_color/blue_p' : 'main_color/yellow_s'];
  const frameOpacity = useRef(new Animated.Value(0)).current;
  const strikeProgress = useRef(new Animated.Value(0)).current;
  const ringProgress = useRef(Array.from({ length: BOARD_SIZE }, () => new Animated.Value(0))).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(frameOpacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      ...(line ?? []).map((_, index) =>
        Animated.timing(ringProgress[index], {
          toValue: 1,
          duration: 220,
          delay: index * RING_STAGGER_MS,
          easing: Easing.out(Easing.back(2)),
          useNativeDriver: true,
        }),
      ),
      Animated.timing(strikeProgress, {
        toValue: 1,
        duration: 260,
        delay: STRIKE_DELAY_MS,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]);
    animation.start();

    return () => animation.stop();
  }, [frameOpacity, line, ringProgress, strikeProgress]);

  // 돌은 판 가운데에 BOARD_SIZE칸으로 놓이므로, 칸의 중심을 판 기준 좌표로 바꾼다
  const gridOffset = (boardWidth - BOARD_SIZE * cellWidth) / 2;
  const centerOf = ({ x, y }: BoardPoint) => ({
    left: gridOffset + (y + 0.5) * cellWidth,
    top: gridOffset + (x + 0.5) * cellWidth,
  });

  const renderLine = () => {
    if (!line) {
      return null;
    }

    const start = centerOf(line[0]);
    const end = centerOf(line[line.length - 1]);
    const length = Math.hypot(end.left - start.left, end.top - start.top);
    const angle = Math.atan2(end.top - start.top, end.left - start.left);
    const ringSize = cellWidth + 4;

    // 선은 줄의 가운데에서 양 끝으로 그어진다
    return (
      <>
        <StrikeLine
          color={color}
          style={{
            left: (start.left + end.left) / 2 - length / 2,
            top: (start.top + end.top) / 2 - 1.5,
            width: length,
            transform: [{ rotate: `${angle}rad` }, { scaleX: strikeProgress }],
          }}
        />
        {line.map((point, index) => {
          const center = centerOf(point);
          return (
            <StoneRing
              key={`${point.x}-${point.y}`}
              color={color}
              size={ringSize}
              style={{
                left: center.left - ringSize / 2,
                top: center.top - ringSize / 2,
                opacity: ringProgress[index],
                transform: [
                  {
                    scale: ringProgress[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [1.8, 1],
                    }),
                  },
                ],
              }}
            />
          );
        })}
      </>
    );
  };

  return (
    <HighlightLayer pointerEvents="none">
      {showFrame && <ResultFrame color={color} style={{ opacity: frameOpacity }} />}
      {renderLine()}
    </HighlightLayer>
  );
};

export default ResultHighlight;
