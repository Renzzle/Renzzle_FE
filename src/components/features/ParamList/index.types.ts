import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
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
  OtherScreen: undefined;
};

type CommunityPuzzleSolveRouteProp = RouteProp<RootStackParamList, 'CommunityPuzzleSolve'>;
type CommunityPuzzleSolveNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CommunityPuzzleSolve'>;
type LessonPuzzleListRouteProp = RouteProp<RootStackParamList, 'LessonPuzzleList'>;
type LessonPuzzleListNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LessonPuzzleList'>;

export type CommunityPuzzleSolveProps = {
  route: CommunityPuzzleSolveRouteProp;
  navigation: CommunityPuzzleSolveNavigationProp;
};

export type LessonPuzzleListProps = {
  route: LessonPuzzleListRouteProp;
  navigation: LessonPuzzleListNavigationProp;
};
