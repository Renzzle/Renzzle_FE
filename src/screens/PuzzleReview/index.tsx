import React, { useEffect, useRef, useState } from 'react';
import { Container, HeaderWrapper, RedoButton, UndoButton, UndoRedoWrapper } from './index.styles';
import Board, { BoardRef } from '../../components/features/Board';
import { Icon } from '../../components/common';
import { RouteProp, StackActions, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../types/ParamList';
import { CommunityPuzzle, TrainingPuzzle } from '../../types/Puzzle';
import PuzzleHeader from '../../components/features/PuzzleHeader';

const PuzzleReview = () => {
  const route =
    useRoute<RouteProp<RootStackParamList, 'PuzzleReview' | 'TrainingPuzzleReview' | 'CommunityPuzzleReview'>>();
  const navigation = useNavigation();
  const isHandlingBackRef = useRef(false);

  const boardRef = useRef<BoardRef>(null);

  const [currentSequence, setCurrentSequence] = useState(route.params.problemSequence);
  const { problemSequence, mainSequence, puzzle, isCommunityPuzzle, title, puzzleNumber, backBehavior } =
    route.params;

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
