import React, { useRef, useState } from 'react';
import {
  BoardWrapper,
  BottomBarSpacer,
  Container,
  CurrentPuzzleWrapper,
  HeaderSideSlot,
  HeaderWrapper,
  PuzzleNumberRow,
  ResultBadge,
  UndoRedoButton,
  UndoRedoWrapper,
} from './index.styles';
import Board, { BoardRef } from '../../components/features/Board';
import { BottomButtonBar, CustomText, Icon } from '../../components/common';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../types/ParamList';
import { RankingResultTheme, ResultVariant } from '../../types';
import PuzzleAttributes from '../../components/features/PuzzleAttributes';
import { useTranslation } from 'react-i18next';

const RankedPuzzleReview = () => {
  const { t } = useTranslation();
  const route = useRoute<RouteProp<RootStackParamList, 'RankedPuzzleReview'>>();
  const { archive, initialIndex } = route.params;

  const boardRef = useRef<BoardRef>(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const currentPuzzle = archive[currentIndex];
  const [currentSequence, setCurrentSequence] = useState(currentPuzzle.boardStatus);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const variant: ResultVariant = currentPuzzle.isSolved ? 'success' : 'error';
  const resultTheme = RankingResultTheme[variant];

  const moveToPuzzle = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= archive.length) {
      return;
    }
    setCurrentIndex(nextIndex);
    setCurrentSequence(archive[nextIndex].boardStatus);
    setCanUndo(false);
    setCanRedo(false);
  };

  const handleDisabledColor = (isEnable: boolean) => {
    if (isEnable) {
      return 'gray/gray500';
    } else {
      return 'gray/gray200';
    }
  };

  return (
    <Container>
      <HeaderWrapper>
        <HeaderSideSlot align="left" />
        <CurrentPuzzleWrapper>
          <PuzzleNumberRow>
            <CustomText size={20} weight="bold" lineHeight="sm" color="gray/black">
              #{currentIndex + 1}
            </CustomText>
            <CustomText size={12} lineHeight="sm" color="gray/gray400">
              / {archive.length}
            </CustomText>
          </PuzzleNumberRow>
          <PuzzleAttributes depth={null} winColor={currentPuzzle.winColor} />
        </CurrentPuzzleWrapper>
        <HeaderSideSlot align="right">
          <ResultBadge variant={variant}>
            <Icon name={resultTheme.iconName} size={14} color={resultTheme.primary} />
            <CustomText size={12} weight="bold" lineHeight="sm" color={resultTheme.primary}>
              {currentPuzzle.isSolved ? t('rankedReview.solved') : t('rankedReview.failed')}
            </CustomText>
          </ResultBadge>
        </HeaderSideSlot>
      </HeaderWrapper>

      <BoardWrapper>
        <Board
          key={currentIndex}
          ref={boardRef}
          mode="make"
          makeMode="review"
          sequence={currentSequence}
          setSequence={setCurrentSequence}
          mainSequence={currentPuzzle.boardStatus + currentPuzzle.answer}
          problemSequence={currentPuzzle.boardStatus}
          onUndoRedoStateChange={(undo, redo) => {
            setCanUndo(undo);
            setCanRedo(redo);
          }}
        />

        <UndoRedoWrapper>
          <UndoRedoButton onPress={() => boardRef.current?.undo()} disabled={!canUndo}>
            <Icon name="ChevronLeftIcon" color={handleDisabledColor(canUndo)} />
          </UndoRedoButton>
          <UndoRedoButton onPress={() => boardRef.current?.redo()} disabled={!canRedo}>
            <Icon name="ChevronRightIcon" color={handleDisabledColor(canRedo)} />
          </UndoRedoButton>
        </UndoRedoWrapper>

        <BottomBarSpacer />
      </BoardWrapper>

      <BottomButtonBar
        transitions={[
          {
            text: t('rankedReview.prev'),
            onAction: () => moveToPuzzle(currentIndex - 1),
            disabled: currentIndex === 0,
          },
          {
            text: t('rankedReview.next'),
            onAction: () => moveToPuzzle(currentIndex + 1),
            disabled: currentIndex === archive.length - 1,
          },
        ]}
      />
    </Container>
  );
};

export default RankedPuzzleReview;
