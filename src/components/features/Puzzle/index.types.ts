export default interface CommunityPuzzle {
  id: number;
  title: string;
  boardStatus: string;
  authorId: number;
  authorName: string;
  solvedCount: number;
  correctRate: number;
  depth: number;
  difficulty: 'HIGH' | 'MIDDLE' | 'LOW';
  winColor: 'BLACK' | 'WHITE';
  likeCount: number;
  tag: string[];
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
