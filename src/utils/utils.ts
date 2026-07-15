import { Difficulty, WinColor } from '../types';

export const BOARD_SIZE = 15;

export const convertToReverseNumber = (num: number): number => {
  if (num < 0 || num > BOARD_SIZE) {
    throw new Error('Input number must be between 0 and 15');
  }
  return BOARD_SIZE - num;
};

export const convertToUppercaseAlphabet = (num: number): string => {
  if (num < 0 || num > BOARD_SIZE) {
    throw new Error('Input number must be between 0 and 15');
  }
  return String.fromCharCode(65 + num);
};

export const convertToLowercaseAlphabet = (num: number): string => {
  if (num < 0 || num > BOARD_SIZE) {
    throw new Error('Input number must be between 0 and 15');
  }
  return String.fromCharCode(97 + num);
};

export const convertLowercaseAlphabetToNumber = (char: string): number => {
  if (char.length !== 1 || char < 'a' || char > 'o') {
    throw new Error('Input character must be a single lowercase letter between a and o');
  }
  return char.charCodeAt(0) - 97;
};

export const valueToCoordinates = (value: number): { x: number; y: number } | null => {
  if (value < 0 || value >= BOARD_SIZE * BOARD_SIZE) {
    return null;
  }

  const y = Math.floor(value / BOARD_SIZE);
  const x = BOARD_SIZE - 1 - (value % BOARD_SIZE);

  return { x, y };
};

export const coordinatesToValue = (x: number, y: number): number | null => {
  if (x < 0 || x >= BOARD_SIZE || y < 0 || y >= BOARD_SIZE) {
    return null;
  }

  return y * BOARD_SIZE + (BOARD_SIZE - 1 - x);
};

export const coordinatesToPosition = (x: number, y: number): string | null => {
  if (x < 0 || x >= BOARD_SIZE || y < 0 || y >= BOARD_SIZE) {
    return null;
  }

  return `${convertToLowercaseAlphabet(y)}${convertToReverseNumber(x)}`;
};

export const positionToValue = (position: string): number | null => {
  const match = position.match(/^([a-o])(1[0-5]|[1-9])$/);

  if (!match) {
    return null;
  }

  const y = convertLowercaseAlphabetToNumber(match[1]);
  const x = convertToReverseNumber(parseInt(match[2], 10));

  return coordinatesToValue(x, y);
};

export interface Move {
  x: number;
  y: number;
  stone: 1 | 2;
}

export const parseSequence = (sequence: string): Move[] => {
  const moves: Move[] = [];
  let turn = true; // true: black (1), false: white (2)

  let i = 0;
  while (i < sequence.length) {
    const letter = sequence[i];
    const numberMatch = sequence.slice(i + 1).match(/^\d{1,2}/); // Match up to 2-digit numbers
    if (!numberMatch) {
      break;
    }

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

export const toDifficultyEnum = (key: string): Difficulty | undefined => {
  switch (key) {
    case 'HIGH':
      return Difficulty.HIGH;
    case 'MIDDLE':
      return Difficulty.MIDDLE;
    case 'LOW':
      return Difficulty.LOW;
    default:
      return undefined;
  }
};

export const toWinColorEnum = (key: string): WinColor | undefined => {
  switch (key) {
    case 'BLACK':
      return WinColor.BLACK;
    case 'WHITE':
      return WinColor.WHITE;
    default:
      return undefined;
  }
};

/**
 * 주어진 수순 문자열의 깊이 (총 이동 횟수)를 계산
 * @param sequence 수순 문자열
 * @returns 수순에 포함된 이동 횟수
 */
export const getSequenceDepth = (sequence: string): number => {
  return parseSequence(sequence).length;
};
