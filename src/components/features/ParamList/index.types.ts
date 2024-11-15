import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  CommunityPuzzleSolve: {
    id: number;
    boardStatus: string;
    title: string;
    author: string;
    description: string;
  };
  OtherScreen: undefined;
};

type CommunityPuzzleSolveRouteProp = RouteProp<RootStackParamList, 'CommunityPuzzleSolve'>;
type CommunityPuzzleSolveNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CommunityPuzzleSolve'>;

export type CommunityPuzzleSolveProps = {
  route: CommunityPuzzleSolveRouteProp;
  navigation: CommunityPuzzleSolveNavigationProp;
};
