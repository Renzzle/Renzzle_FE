import React from 'react';
import { BoardWrapper, Container, HeaderWrapper } from './index.styles';
import PuzzleHeader from '../../components/features/PuzzleHeader';
import Board from '../../components/features/Board';

const TrainingPuzzleSolve = () => {
  return (
    <Container>
      <HeaderWrapper>
        <PuzzleHeader
          title="dkssyd"
          depth={3}
          winColor="WHITE"
          isSolved
          isCommunityPuzzle={false}
        />
      </HeaderWrapper>

      <BoardWrapper>
        <Board
          mode="solve"
          sequence="a1"
          setSequence={() => {}}
          setIsWin={() => {}}
          setIsLoading={() => {}}
          winDepth={255}
        />
      </BoardWrapper>
    </Container>
  );
};

export default TrainingPuzzleSolve;
