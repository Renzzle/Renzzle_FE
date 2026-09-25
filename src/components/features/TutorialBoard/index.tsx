import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import { CellOverlay, CellWrapper, TargetRing } from './index.styles';
import { Cell, StoneType } from '../Board';
import {
  BoardBackground,
  FramContainer,
  FrameCell,
  FrameRow,
  StoneRow,
} from '../Board/index.styles';
import BoardFrameNumber from '../Board/BoardFrameNumber';
import { Icon } from '../../common';
import useDeviceWidth from '../../../hooks/useDeviceWidth';
import { BOARD_SIZE, coordinatesToPosition, positionToCoordinates } from '../../../utils/utils';

export interface PlacedStone {
  position: string;
  stone: StoneType;
  isForbidden: boolean;
}

interface TutorialBoardProps {
  black: string[];
  white: string[];
  forbidden?: string[];
  target?: string;
  placedStone?: PlacedStone | null;
  // 같은 칸을 두 번 눌러 착수했을 때 호출 (실제 보드와 같은 조작)
  onPlace?: (position: string) => void;
}

const PulsingTargetRing = ({ size }: { size: number }) => {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();

    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.View style={{ opacity }}>
      <TargetRing size={size} />
    </Animated.View>
  );
};

const TutorialBoard = ({
  black,
  white,
  forbidden = [],
  target,
  placedStone = null,
  onPlace,
}: TutorialBoardProps) => {
  const width = useDeviceWidth();
  const boardWidth = width - 20;
  const cellWidth = (boardWidth - 26) / 14;

  const [selected, setSelected] = useState<{ x: number; y: number } | null>(null);

  const stones = useMemo(() => {
    const grid: StoneType[][] = Array.from({ length: BOARD_SIZE }, () =>
      Array.from({ length: BOARD_SIZE }, () => 0 as StoneType),
    );

    const putStones = (positions: string[], stone: StoneType) => {
      positions.forEach((position) => {
        const coordinates = positionToCoordinates(position);
        if (coordinates) {
          grid[coordinates.x][coordinates.y] = stone;
        }
      });
    };

    putStones(black, 1);
    putStones(white, 2);
    if (placedStone) {
      putStones([placedStone.position], placedStone.stone);
    }

    return grid;
  }, [black, white, placedStone]);

  const handleCellPress = (x: number, y: number) => {
    if (!onPlace || stones[x][y] !== 0) {
      return;
    }

    if (selected?.x === x && selected?.y === y) {
      setSelected(null);
      const position = coordinatesToPosition(x, y);
      if (position) {
        onPlace(position);
      }
      return;
    }

    setSelected({ x, y });
  };

  const renderOverlay = (position: string | null, isSelected: boolean) => {
    // 둔 돌의 금수 X 표시는 Cell이 직접 그린다
    if (!position || placedStone?.position === position) {
      return null;
    }

    if (forbidden.includes(position)) {
      return <Icon name="CrossIcon" color="error/error_color" size={cellWidth * 0.9} />;
    }

    if (!placedStone && target === position && !isSelected) {
      return <PulsingTargetRing size={cellWidth * 0.8} />;
    }

    return null;
  };

  return (
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
      {stones.map((row, x) => (
        <StoneRow key={x}>
          {row.map((stone, y) => {
            const position = coordinatesToPosition(x, y);
            const isSelected = selected?.x === x && selected?.y === y;
            const isPlacedStone = placedStone?.position === position;
            const overlay = renderOverlay(position, isSelected);

            return (
              <CellWrapper key={`${x}-${y}`} cellWidth={cellWidth}>
                <Cell
                  pos={`${x}-${y}`}
                  stone={stone}
                  cellWidth={cellWidth}
                  stoneX={selected?.x}
                  stoneY={selected?.y}
                  sequence={isPlacedStone ? -1 : null}
                  onPress={() => handleCellPress(x, y)}
                  isForbidden={isPlacedStone && !!placedStone?.isForbidden}
                />
                {overlay && <CellOverlay pointerEvents="none">{overlay}</CellOverlay>}
              </CellWrapper>
            );
          })}
        </StoneRow>
      ))}
    </BoardBackground>
  );
};

export default TutorialBoard;
