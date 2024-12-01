
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { BoardAndPutContainer, BoardBackground, CellContainer, FramContainer, FrameCell, FrameRow, IndicatePoint, PutButtonContainer, Stone, StoneRow } from './index.styles';
import useDeviceWidth from '../../../hooks/useDeviceWidth';
import BoardFrameNumber from './BoardFrameNumber';
import CircleButton from '../CircleButton';
import { AppIcon } from '../../common/Icons';
import theme from '../../../styles/theme';
import { BOARD_SIZE, convertLowercaseAlphabetToNumber, convertToLowercaseAlphabet, convertToReverseNumber, valueToCoordinates } from '../../../utils/utils';
import { NativeModules, ViewStyle } from 'react-native';

export type StoneType = 0 | 1 | 2; // 0: Empty, 1: Black, 2: White

interface BoardProps {
  mode: 'make' | 'solve';
  sequence: string;
  setSequence: (sequence: string) => void;
  setIsWin?: (isWin: boolean | null) => void;
  setIsLoading?: (isLoading: boolean | null) => void;
  winDepth?: number;
}

const Board = ({ mode, sequence = '', setSequence, setIsWin, setIsLoading, winDepth }: BoardProps) => {
  const width = useDeviceWidth();
  const boardWidth = width - 20;
  const cellWidth = (boardWidth - 26) / 14;

  const [board, setBoard] = useState<StoneType[][]>(
    Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0))
  );
  const [isBlackTurn, setIsBlackTurn] = useState(true);
  const [stoneX, setStoneX] = useState<number | null>();
  const [stoneY, setStoneY] = useState<number | null>();

  const [aiAnswer, setAiAnswer] = useState<number>();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const { UserAgainstActionJNI } = NativeModules;
  const [localSequence, setLocalSequence] = useState(sequence);
  const [confirmPut, setConfirmPut] = useState<boolean>(false);
  const [depth, setDepth] = useState(0);

  const updateBoard = (x: number, y: number) => {
    const newBoard = board.map((row) => [...row]); // copy row
    newBoard[x][y] = isBlackTurn ? 1 : 2;
    setBoard(newBoard);
  };

  const addToSequence = (x: number, y: number) => {
    const letter = convertToLowercaseAlphabet(y);
    const number = convertToReverseNumber(x).toString();
    const updatedSequence = localSequence + letter + number;
    setLocalSequence(updatedSequence);

    if (mode === 'make') {
      setSequence(updatedSequence);
    }
  };

  const handlePut = async () => {
    if (stoneX !== undefined && stoneY !== undefined && stoneX !== null && stoneY !== null) {
      if (board[stoneX][stoneY] !== 0) {return;}

      addToSequence(stoneX, stoneY);
      updateBoard(stoneX, stoneY);
      setIsBlackTurn(!isBlackTurn);
      setStoneX(null);
      setStoneY(null);

      if (mode === 'solve') {
        setDepth((prevDepth) => prevDepth + 1);
        setIsDisabled(true);
        setIsLoading?.(true);
        setConfirmPut(true); // user put ok
      }
    }
  };

  const handleAiTurn = async (userSequence: string) => {
    try {
      const result = await UserAgainstActionJNI.calculateSomethingWrapper(userSequence);
      if (result === -1) {setIsWin?.(false);}
      if (result === 1000) {setIsWin?.(true);}
      setAiAnswer(result);
    } catch (error) {
      console.error('AI computation failed: ', error);
    }
  };

  useEffect(() => {
    const processAiAnswer = async () => {
      if (aiAnswer !== null && aiAnswer !== undefined) {
        const coordinates = valueToCoordinates(aiAnswer);
        if (!coordinates) {return;}

        const { x, y } = coordinates;
        addToSequence(x,y);
        updateBoard(x, y);
        setIsBlackTurn(!isBlackTurn);
        setConfirmPut(false);
        setIsDisabled(false);
        setIsLoading?.(false);
        setDepth((prevDepth) => prevDepth + 1);
      }
    };

    processAiAnswer();
  }, [aiAnswer]);

  useEffect(() => {
    const userPutComplete = async () => {
      await handleAiTurn(localSequence);
    };
    if (confirmPut && mode === 'solve') {
      userPutComplete();
    }
  }, [localSequence, confirmPut]);

  useEffect(() => {
    if (winDepth !== undefined && depth > winDepth) {
      setIsWin?.(false);
    }
  }, [depth, winDepth]);

  const initializeBoard = () => {
    const newBoard = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
    let turn = true;

    let i = 0;
    while (i < sequence.length) {
      const letter = sequence[i];
      const numberMatch = sequence.slice(i + 1).match(/^\d{1,2}/);
      if (!numberMatch) {
        console.error(`Invalid sequence format at index ${i}: ${sequence}`);
        break;
      }

      const number = numberMatch[0];
      const x = convertToReverseNumber(parseInt(number, 10));
      const y = convertLowercaseAlphabetToNumber(letter);

      if (x >= 0 || x < BOARD_SIZE || y >= 0 || y < BOARD_SIZE) {
        newBoard[x][y] = turn ? 1 : 2;
        turn = !turn;
      }
      i += 1 + number.length;
    }

    setBoard(newBoard);
    setIsBlackTurn(turn);
    setDepth(0);
  };

  useEffect(() => {
    initializeBoard();
  }, [sequence]);

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
              <Cell
                key={`${x}-${y}`}
                pos={`${x}-${y}`}
                stone={cell}
                cellWidth={cellWidth}
                stoneX={stoneX}
                stoneY={stoneY}
                onPress={() => {
                  setStoneX(x);
                  setStoneY(y);
                }}
              />
            ))}
          </StoneRow>
        ))}
      </BoardBackground>
      <PutButtonContainer>
        <CircleButton onPress={handlePut} category="put" disabled={isDisabled} />
      </PutButtonContainer>
    </BoardAndPutContainer>
  );
};

interface CellProps {
  pos: string;
  stone: StoneType;
  cellWidth: number;
  stoneX: number | null | undefined;
  stoneY: number | null | undefined;
  onPress: () => void;
  showHighlights?: boolean;
  style?: ViewStyle;
}

export const Cell = ({ pos, stone, cellWidth, stoneX, stoneY, onPress, showHighlights = true, style }: CellProps) => {
  return (
    <CellContainer onPress={onPress} cellWidth={cellWidth} style={style}>
      {stone !== 0 ? (
        <Stone stone={stone} cellWidth={cellWidth} />
      ) : showHighlights && pos === `${stoneX}-${stoneY}` ? (
        <AppIcon name="image-filter-center-focus" size={cellWidth} color={theme.color['error/error_color']} />
      ) : showHighlights &&
        (pos === '3-3' || pos === '3-11' || pos === '11-3' || pos === '11-11' || pos === '7-7') ? (
        <IndicatePoint />
      ) : null}
    </CellContainer>
  );
};

export default Board;
