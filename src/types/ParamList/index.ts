import { CommunityPuzzle, TrainingPack, TrainingPuzzle } from '../Puzzle';
import { RankArchive } from '../Ranking';

export type PuzzleReviewBackBehavior = 'popTwo';
export type TrainingPuzzleReviewAction = 'next' | 'retry' | 'complete';

export interface PuzzleReviewParams {
  problemSequence: string;
  mainSequence: string;
  puzzle: CommunityPuzzle | TrainingPuzzle;
  isCommunityPuzzle: boolean;
  title?: string;
  puzzleNumber?: number;
  backBehavior?: PuzzleReviewBackBehavior;
  reviewAction?: TrainingPuzzleReviewAction;
}

export type RootStackParamList = {
  CommunityPuzzleSolve: {
    puzzle: CommunityPuzzle;
    fromScreen?: 'CommunityPuzzles' | 'MyPuzzles' | 'LikedPuzzles';
    reviewAction?: TrainingPuzzleReviewAction;
  };
  CommunityPuzzles: {
    updatedItem?: CommunityPuzzle;
  };
  TrainingPuzzleSolve: {
    puzzles: TrainingPuzzle[];
    pack: TrainingPack;
    puzzleNumber: number;
    reviewAction?: TrainingPuzzleReviewAction;
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
  TrainingPuzzleViewAnswer: PuzzleReviewParams;
  CommunityPuzzleReview: PuzzleReviewParams;
  CommunityPuzzleViewAnswer: PuzzleReviewParams;
  AnswerCommunityPuzzle: {
    problemSequence: string;
    description: string;
  };
  RankedGameResult: {
    rating?: number;
    reward?: number;
    ratingDelta?: number;
  };
  RankedPuzzleReview: {
    archive: RankArchive[];
    initialIndex: number;
  };
  OtherScreen: undefined;
};
