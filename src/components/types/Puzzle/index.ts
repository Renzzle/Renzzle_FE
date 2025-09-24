export interface CommunityPuzzle {
  id: number;
  boardStatus: string;
  authorId: number;
  authorName: string;
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

export interface LessonPuzzle {
  id: number;
  title: string;
  boardStatus: string;
  depth: number;
  difficulty: 'HIGH' | 'MIDDLE' | 'LOW';
  winColor: 'BLACK' | 'WHITE';
  description: string;
  isLocked: boolean;
}

export interface CommunityPuzzleListResponse {
  isSuccess: boolean;
  response: CommunityPuzzle[];
}

export interface LessonPuzzleListResponse {
  isSuccess: boolean;
  response: LessonPuzzle[];
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
