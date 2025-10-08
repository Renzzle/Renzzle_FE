import { CommunityPuzzle, TrainingPack, TrainingPuzzle } from '../Puzzle';

export type RootStackParamList = {
  CommunityPuzzleSolve: {
    puzzle: CommunityPuzzle;
  };
  TrainingPuzzleSolve: {
    puzzle: TrainingPuzzle;
  };
  TrainingPuzzles: {
    pack: TrainingPack;
  };
  OtherScreen: undefined;
};
