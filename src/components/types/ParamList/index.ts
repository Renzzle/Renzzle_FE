import { CommunityPuzzle, TrainingPack } from '../Puzzle';

export type RootStackParamList = {
  CommunityPuzzleSolve: {
    puzzle: CommunityPuzzle;
  };
  TrainingPuzzles: {
    pack: TrainingPack;
  };
  OtherScreen: undefined;
};
