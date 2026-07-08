import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import { PuzzleReviewBackBehavior, TrainingPuzzleReviewAction } from '../../types/ParamList';
import { CommunityPuzzle, TrainingPuzzle } from '../../types/Puzzle';

type PuzzleReviewDestination = 'review' | 'viewAnswer';

interface BasePuzzleReviewParams {
  answer: string;
  backBehavior?: PuzzleReviewBackBehavior;
  destination?: PuzzleReviewDestination;
}

interface CommunityPuzzleReviewParams extends BasePuzzleReviewParams {
  puzzle: CommunityPuzzle;
  reviewAction?: TrainingPuzzleReviewAction;
}

interface TrainingPuzzleReviewParams extends BasePuzzleReviewParams {
  puzzle: TrainingPuzzle;
  title?: string;
  puzzleNumber?: number;
  reviewAction?: TrainingPuzzleReviewAction;
}

const createPuzzleReviewSequences = (problemSequence: string, answer: string) => ({
  problemSequence,
  mainSequence: problemSequence + answer,
});

const usePuzzleReviewNavigation = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const navigateToCommunityPuzzleReview = useCallback(
    ({
      puzzle,
      answer,
      backBehavior,
      reviewAction,
      destination = 'review',
    }: CommunityPuzzleReviewParams) => {
      const routeName =
        destination === 'viewAnswer' ? 'CommunityPuzzleViewAnswer' : 'CommunityPuzzleReview';

      navigation.navigate(routeName, {
        ...createPuzzleReviewSequences(puzzle.boardStatus, answer),
        puzzle,
        isCommunityPuzzle: true,
        backBehavior,
        reviewAction,
      });
    },
    [navigation],
  );

  const navigateToTrainingPuzzleReview = useCallback(
    ({
      puzzle,
      answer,
      title,
      puzzleNumber,
      backBehavior,
      reviewAction,
      destination = 'review',
    }: TrainingPuzzleReviewParams) => {
      const routeName =
        destination === 'viewAnswer' ? 'TrainingPuzzleViewAnswer' : 'TrainingPuzzleReview';

      navigation.navigate(routeName, {
        ...createPuzzleReviewSequences(puzzle.boardStatus, answer),
        puzzle,
        isCommunityPuzzle: false,
        title,
        puzzleNumber,
        backBehavior,
        reviewAction,
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
