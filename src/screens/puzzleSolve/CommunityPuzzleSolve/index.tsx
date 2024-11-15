import React from 'react';
import { CommunityPuzzleSolveProps } from '../../../components/features/ParamList/index.types';
import { IndicatorContainer, SolveContainer } from './index.styles';
import PuzzleHeader from '../../../components/features/PuzzleHeader';
import GameStatusIndicator from '../../../components/features/GameStatusIndicator';
import Board from '../../../components/features/Board';

const CommunityPuzzleSolve = ({ route }: CommunityPuzzleSolveProps) => {
  const { id, boardStatus, title, author, description } = route.params;

  console.log(id + boardStatus + title + author + description);
  // TODO: 레이아웃 개발
  return (
    <SolveContainer>
      <PuzzleHeader
        title={title}
        info={description}
        author={author}
        puzzleNum={`${id}`}
        isLiked={false}
      />

      <IndicatorContainer>
        <GameStatusIndicator />
      </IndicatorContainer>

      <Board mode="solve" sequence={boardStatus} setSequence={() => {}} />
    </SolveContainer>
  );
};

export default CommunityPuzzleSolve;
