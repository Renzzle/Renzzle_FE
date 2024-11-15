import { Difficulty, WinColor } from '../components/features/Puzzle/index.types';

export const BOARD_SIZE = 15;

export const convertToReverseNumber = (num: number): number => {
  if (num < 0 || num > BOARD_SIZE - 1) {
    throw new Error('Input number must be between 0 and 14');
  }
  return BOARD_SIZE - num;
};

export const convertToUppercaseAlphabet = (num: number): string => {
  if (num < 0 || num > BOARD_SIZE - 1) {
    throw new Error('Input number must be between 0 and 14');
  }
  return String.fromCharCode(65 + num);
};

export const convertToLowercaseAlphabet = (num: number): string => {
  if (num < 0 || num > BOARD_SIZE - 1) {
    throw new Error('Input number must be between 0 and 14');
  }
  return String.fromCharCode(97 + num);
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
