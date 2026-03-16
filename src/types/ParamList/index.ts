import { CommunityPuzzle, TrainingPack, TrainingPuzzle } from '../Puzzle';

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
  PuzzleReview: {
    problemSequence: string;
    mainSequence: string;
    puzzle: CommunityPuzzle | TrainingPuzzle;
    isCommunityPuzzle: boolean;
    title?: string;
    puzzleNumber?: number;
  };
  AnswerCommunityPuzzle: {
    problemSequence: string;
    description: string;
  };
  OtherScreen: undefined;
};
