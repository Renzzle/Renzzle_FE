/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { BoardAndPutContainer, BoardBackground, CellContainer, FramContainer, FrameCell, FrameRow, IndicatePoint, PutButtonContainer, Stone, StoneRow } from './index.styles';
import useDeviceWidth from '../../../hooks/useDeviceWidth';
import BoardFrameNumber from './BoardFrameNumber';
import CircleButton from '../CircleButton';
import { AppIcon } from '../../common/Icons';
import theme from '../../../styles/theme';
import { BOARD_SIZE, convertLowercaseAlphabetToNumber, convertToLowercaseAlphabet, convertToReverseNumber, valueToCoordinates } from '../../../utils/utils';
import { NativeModules } from 'react-native';

export type StoneType = 0 | 1 | 2; // 0: Empty, 1: Black, 2: White

interface BoardProps {
  mode: 'make' | 'solve';
  sequence: string;
  setSequence: (sequence: string) => void;
  setIsWin?: (isWin: boolean | null) => void;
}

const Board = ({ mode, sequence = '', setSequence, setIsWin }: BoardProps) => {
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

  const updateBoard = (x: number, y: number,) => {
    const newBoard = board.map((row) => [...row]); // copy row
    newBoard[x][y] = isBlackTurn ? 1 : 2;
    setBoard(newBoard);
  };

  const handlePut = async () => {
    if (stoneX !== undefined && stoneY !== undefined && stoneX !== null && stoneY !== null) {
      if (board[stoneX][stoneY] !== 0) {return;}

      const letter = convertToLowercaseAlphabet(stoneY);
      const number = convertToReverseNumber(stoneX).toString();
      setSequence(localSequence + letter + number); // make용
      // sequence = sequence + letter + number;


      await new Promise<void>((resolve) => {
        setLocalSequence((prevSequence) => {
          const updatedSequence = prevSequence + letter + number;
          resolve(); // 상태 업데이트 완료 후 resolve
          return updatedSequence;
        });
      });
      console.log('Sequence1: ' + localSequence);

      updateBoard(stoneX, stoneY);

      setIsBlackTurn(!isBlackTurn);
      setStoneX(null);
      setStoneY(null);
      if (mode === 'solve') {
        console.log('solve!!!');
        setConfirmPut(true);
        setIsDisabled(true);
      }
    }
  };

  useEffect(() => {
    if (confirmPut === true && mode === 'solve') {
      console.log('AI 작업 시작: ' + localSequence);
      handleAiPut();
    }
  }, [confirmPut]);

  const handleAiPut = async () => {
    await getAiAnswer();
  };

  const getAiAnswer = async () => {
    try {
      setConfirmPut(false);
      console.log('Sequence2: ' + localSequence);
      const result = await UserAgainstActionJNI.calculateSomethingWrapper(localSequence);
      if (result === -1 && setIsWin !== undefined) {setIsWin(false);}
      if (result === 1000 && setIsWin !== undefined) {setIsWin(true);}
      console.log('AI Answer Result: ', result);
      setAiAnswer(result);
    } catch (error) {
      console.error('AI Answer failed: ', error);
    }
  };

  useEffect(() => {
    if (aiAnswer !== undefined) {
      console.log('세팅들어옴!!!!');
      const coordinates = valueToCoordinates(aiAnswer);

      if (coordinates) {
        const { x, y } = coordinates;
        console.log('setX: ' + x + ' | setY: ' + y);

        updateBoard(x, y);
        const letter = convertToLowercaseAlphabet(y);
        const number = convertToReverseNumber(x).toString();

        setLocalSequence((prevSequence) => prevSequence + letter + number);
        console.log('Sequence3ai:' + localSequence);
        // sequence = sequence + letter + number;
      }

      setIsDisabled(false);
      setIsBlackTurn(!isBlackTurn);
    }
  }, [aiAnswer]);

  const handlePlaceStone = (x: number, y: number) => {
    setStoneX(x);
    setStoneY(y);
  };

  const applySequenceToBoard = () => {
    const newBoard = Array.from({ length: BOARD_SIZE }, () =>
      Array(BOARD_SIZE).fill(0)
    );

    let localIsBlackTurn = true; // 로컬 변수로 관리
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

      // Skip invalid coordinates
      if (x < 0 || x >= BOARD_SIZE || y < 0 || y >= BOARD_SIZE) {
        console.warn(`Skipping invalid coordinate: (${letter}${number})`);
        i += 1 + number.length;
        continue;
      }

      newBoard[x][y] = localIsBlackTurn ? 1 : 2; // Black = 1, White = 2
      localIsBlackTurn = !localIsBlackTurn; // Switch turn
      i += 1 + number.length;
    }

    setBoard(newBoard);
    setIsBlackTurn(localIsBlackTurn); // 최종 값 상태에 반영
  };

  useEffect(() => {
    applySequenceToBoard();
  }, []);

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
              <Cell key={`${x}-${y}`} pos={`${x}-${y}`} stone={cell} cellWidth={cellWidth} stoneX={stoneX} stoneY={stoneY} onPress={() => handlePlaceStone(x, y)} />
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
}

const Cell = ({ pos, stone, cellWidth, stoneX, stoneY, onPress }: CellProps) => {
  return (
    <CellContainer onPress={onPress} cellWidth={cellWidth}>
      {stone !== 0 ? (
        <Stone stone={stone} cellWidth={cellWidth} />
      ) : (
        (pos === `${stoneX}-${stoneY}`) ? (
          <AppIcon name="image-filter-center-focus" size={cellWidth} color={theme.color['error/error_color']} />
        ) : (
          (pos === '3-3' || pos === '3-11' || pos === '11-3' || pos === '11-11' || pos === '7-7') && (
            <IndicatePoint />
          ))
      )}
    </CellContainer>
  );
};

export default Board;
