import { CommunityPuzzle, TrainingPack, TrainingPuzzle } from '../Puzzle';

export type PuzzleReviewBackBehavior = 'popTwo';

export interface PuzzleReviewParams {
  problemSequence: string;
  mainSequence: string;
  puzzle: CommunityPuzzle | TrainingPuzzle;
  isCommunityPuzzle: boolean;
  title?: string;
  puzzleNumber?: number;
  backBehavior?: PuzzleReviewBackBehavior;
}

export type RootStackParamList = {
  CommunityPuzzleSolve: {
    puzzle: CommunityPuzzle;
    fromScreen?: 'CommunityPuzzles' | 'MyPuzzles' | 'LikedPuzzles';
  };
  CommunityPuzzles: {
    updatedItem?: CommunityPuzzle;
  };
  TrainingPuzzleSolve: {
    puzzles: TrainingPuzzle[];
    pack: TrainingPack;
    puzzleNumber: number;
  };
  TrainingPuzzles: {
    pack: TrainingPack;
    updatedItems?: TrainingPuzzle[];
  };
  TrainingPacks: {
    updatedPack?: TrainingPack;
  };
  PuzzleReview: PuzzleReviewParams;
  TrainingPuzzleReview: PuzzleReviewParams;
  CommunityPuzzleReview: PuzzleReviewParams;
  AnswerCommunityPuzzle: {
    problemSequence: string;
    description: string;
  };
  OtherScreen: undefined;
};
