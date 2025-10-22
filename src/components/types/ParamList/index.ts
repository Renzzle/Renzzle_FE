import { CommunityPuzzle, TrainingPack, TrainingPuzzle } from '../Puzzle';

export type RootStackParamList = {
  CommunityPuzzleSolve: {
    puzzle: CommunityPuzzle;
  };
  TrainingPuzzleSolve: {
    puzzles: TrainingPuzzle[];
    title: string;
    puzzleNumber: number;
  };
  TrainingPuzzles: {
    pack: TrainingPack;
  };
  PuzzleReview: {
    problemSequence: string;
    mainSequence: string;
  };
  AnswerCommunityPuzzle: {
    problemSequence: string;
    description: string;
  };
  OtherScreen: undefined;
};
