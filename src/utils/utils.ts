import { Difficulty, WinColor } from '../components/types';

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
