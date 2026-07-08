import React, { useEffect, useRef, useState } from 'react';
import {
  ButtonWrapper,
  Container,
  HeaderWrapper,
  RedoButton,
  UndoButton,
  UndoRedoWrapper,
} from './index.styles';
import Board, { BoardRef } from '../../components/features/Board';
import { Icon } from '../../components/common';
import {
  CommonActions,
  RouteProp,
  StackActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/ParamList';
import { CommunityPuzzle, TrainingPuzzle } from '../../types/Puzzle';
import PuzzleHeader from '../../components/features/PuzzleHeader';
import ReviewButton from '../../components/features/ReviewButton';
import { useTranslation } from 'react-i18next';

const PuzzleReview = () => {
  const { t } = useTranslation();

  const REVIEW_ACTION_LABELS = {
    next: t('modal.trainingPuzzleSuccess.confirm'),
    retry: t('modal.trainingPuzzleFailure.cancel'),
    complete: t('button.complete'),
  };

  const route =
    useRoute<
      RouteProp<
        RootStackParamList,
        | 'PuzzleReview'
        | 'TrainingPuzzleReview'
        | 'TrainingPuzzleViewAnswer'
        | 'CommunityPuzzleReview'
        | 'CommunityPuzzleViewAnswer'
      >
    >();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isHandlingBackRef = useRef(false);

  const boardRef = useRef<BoardRef>(null);

  const [currentSequence, setCurrentSequence] = useState(route.params.problemSequence);
  const {
    problemSequence,
    mainSequence,
    puzzle,
    isCommunityPuzzle,
    title,
    puzzleNumber,
    backBehavior,
    reviewAction,
  } = route.params;

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const handleUndo = () => {
    boardRef.current?.undo();
  };

  const handleRedo = () => {
    boardRef.current?.redo();
  };

  const handleDisabledColor = (isEnable: boolean) => {
    if (isEnable) {
      return 'gray/gray500';
    } else {
      return 'gray/gray200';
    }
  };

  const handleReviewActionPress = () => {
    if (!reviewAction) {
      return;
    }

    isHandlingBackRef.current = true;
    navigation.dispatch(
      CommonActions.navigate({
        name: isCommunityPuzzle ? 'CommunityPuzzleSolve' : 'TrainingPuzzleSolve',
        params: { reviewAction },
        merge: true,
      }),
    );
  };

  useEffect(() => {
    if (backBehavior !== 'popTwo') {
      return;
    }

    const unsubscribe = navigation.addListener('beforeRemove', (event) => {
      if (isHandlingBackRef.current) {
        return;
      }

      event.preventDefault();
      isHandlingBackRef.current = true;
      navigation.dispatch(StackActions.pop(2));
    });

    return unsubscribe;
  }, [backBehavior, navigation]);

  return (
    <Container>
      <HeaderWrapper>
        <PuzzleHeader
          title={
            isCommunityPuzzle
              ? (puzzle as CommunityPuzzle).authorName
              : title ?? (puzzle as TrainingPuzzle).id.toString()
          }
          depth={puzzle.depth}
          winColor={puzzle.winColor}
          displayNumber={puzzleNumber}
          isVerified={isCommunityPuzzle ? (puzzle as CommunityPuzzle).isVerified : undefined}
          isSolved={puzzle.isSolved}
          isCommunityPuzzle={isCommunityPuzzle}
        />
        {reviewAction ? (
          <ButtonWrapper>
            <ReviewButton onPress={handleReviewActionPress}>
              {REVIEW_ACTION_LABELS[reviewAction]}
            </ReviewButton>
          </ButtonWrapper>
        ) : null}
      </HeaderWrapper>

      <Board
        ref={boardRef}
        mode="make"
        makeMode="review"
        sequence={currentSequence}
        setSequence={setCurrentSequence}
        mainSequence={mainSequence}
        problemSequence={problemSequence}
        onUndoRedoStateChange={(undo, redo) => {
          setCanUndo(undo);
          setCanRedo(redo);
        }}
      />

      <UndoRedoWrapper>
        <UndoButton onPress={handleUndo} disabled={!canUndo}>
          <Icon name="ChevronLeftIcon" color={handleDisabledColor(canUndo)} />
        </UndoButton>
        <RedoButton onPress={handleRedo} disabled={!canRedo}>
          <Icon name="ChevronRightIcon" color={handleDisabledColor(canRedo)} />
        </RedoButton>
      </UndoRedoWrapper>
    </Container>
  );
};

export default PuzzleReview;
