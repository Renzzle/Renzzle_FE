import { TrainingPack } from '../Puzzle';

export type RootStackParamList = {
  CommunityPuzzleSolve: {
    id: number;
    boardStatus: string;
    title: string;
    author: string;
    description: string;
    depth: number;
  };
  LessonPuzzleList: {
    chapter: number;
  };
  TrainingPuzzles: {
    pack: TrainingPack;
  };
  OtherScreen: undefined;
};
