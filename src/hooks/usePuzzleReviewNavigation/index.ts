import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import { PuzzleReviewBackBehavior } from '../../types/ParamList';
import { CommunityPuzzle, TrainingPuzzle } from '../../types/Puzzle';

interface BasePuzzleReviewParams {
  answer: string;
  backBehavior?: PuzzleReviewBackBehavior;
}

interface CommunityPuzzleReviewParams extends BasePuzzleReviewParams {
  puzzle: CommunityPuzzle;
}

interface TrainingPuzzleReviewParams extends BasePuzzleReviewParams {
  puzzle: TrainingPuzzle;
  title?: string;
  puzzleNumber?: number;
}

const createPuzzleReviewSequences = (problemSequence: string, answer: string) => ({
  problemSequence,
  mainSequence: problemSequence + answer,
});

const usePuzzleReviewNavigation = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const navigateToCommunityPuzzleReview = useCallback(
    ({ puzzle, answer, backBehavior }: CommunityPuzzleReviewParams) => {
      navigation.navigate('CommunityPuzzleReview', {
        ...createPuzzleReviewSequences(puzzle.boardStatus, answer),
        puzzle,
        isCommunityPuzzle: true,
        backBehavior,
      });
    },
    [navigation],
  );

  const navigateToTrainingPuzzleReview = useCallback(
    ({ puzzle, answer, title, puzzleNumber, backBehavior }: TrainingPuzzleReviewParams) => {
      navigation.navigate('TrainingPuzzleReview', {
        ...createPuzzleReviewSequences(puzzle.boardStatus, answer),
        puzzle,
        isCommunityPuzzle: false,
        title,
        puzzleNumber,
        backBehavior,
      });
    },
    [navigation],
  );

  return {
    navigateToCommunityPuzzleReview,
    navigateToTrainingPuzzleReview,
  };
};

export default usePuzzleReviewNavigation;
