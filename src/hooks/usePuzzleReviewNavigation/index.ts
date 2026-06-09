import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import { CommunityPuzzle, TrainingPuzzle } from '../../types';

interface BasePuzzleReviewParams {
  answer: string;
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
    ({ puzzle, answer }: CommunityPuzzleReviewParams) => {
      navigation.navigate('CommunityPuzzleReview', {
        ...createPuzzleReviewSequences(puzzle.boardStatus, answer),
        puzzle,
        isCommunityPuzzle: true,
      });
    },
    [navigation],
  );

  const navigateToTrainingPuzzleReview = useCallback(
    ({ puzzle, answer, title, puzzleNumber }: TrainingPuzzleReviewParams) => {
      navigation.navigate('TrainingPuzzleReview', {
        ...createPuzzleReviewSequences(puzzle.boardStatus, answer),
        puzzle,
        isCommunityPuzzle: false,
        title,
        puzzleNumber,
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
