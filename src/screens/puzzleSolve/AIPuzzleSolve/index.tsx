import React from 'react';
import Board from '../../../components/features/Board';
import PuzzleHeader from '../../../components/features/PuzzleHeader';
import GameStatusIndicator from '../../../components/features/GameStatusIndicator';
import {IndicatorContainer, SolveContainer } from './index.styles';

const AIPuzzleSolve = () => {
  return (
    <SolveContainer>
      <PuzzleHeader
        title="흑선승 VCF"
        info="해결 130 • 정답률 86% • 깊이 3 • 난이도 하 • 흑선승"
        author="isoo"
        puzzleNum="1111"
        isLiked
      />

      <IndicatorContainer>
        <GameStatusIndicator />
      </IndicatorContainer>

      <Board mode="solve" sequence="" setSequence={() => {}} />
    </SolveContainer>
  );
};

export default AIPuzzleSolve;
