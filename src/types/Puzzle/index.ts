export interface CommunityPuzzle {
  id: number;
  boardStatus: string;
  authorId: number;
  authorName: string;
  description: string;
  depth: number;
  winColor: 'BLACK' | 'WHITE';
  solvedCount: number;
  views: number;
  likeCount: number;
  createdAt: string;
  isSolved: boolean;
  isVerified: boolean;
  myLike?: boolean;
  myDislike?: boolean;
}

export type CommunityPuzzlePatch = Pick<CommunityPuzzle, 'id'> &
  Partial<Omit<CommunityPuzzle, 'id'>>;

export interface TrainingPack {
  id: number;
  title: string;
  author: string;
  description: string;
  price: number;
  totalPuzzleCount: number;
  solvedPuzzleCount: number;
  locked: boolean;
}

export interface TrainingPuzzle {
  id: number;
  boardStatus: string;
  depth: number;
  winColor: 'BLACK' | 'WHITE';
  isSolved: boolean;
}

export interface CommunityPuzzleListResponse {
  isSuccess: boolean;
  response: CommunityPuzzle[];
}

export enum Difficulty {
  HIGH = '상',
  MIDDLE = '중',
  LOW = '하',
}

export enum WinColor {
  'BLACK' = '흑',
  'WHITE' = '백',
}

export const DEPTH = {
  MIN: 1,
  MAX: 225,
  SEARCH_MAX: 31,
} as const;

export type Depth = number;
