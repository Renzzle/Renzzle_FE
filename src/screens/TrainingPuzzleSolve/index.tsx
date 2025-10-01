import React, { useEffect, useState } from 'react';
import { BoardWrapper, Container, HeaderWrapper } from './index.styles';
import PuzzleHeader from '../../components/features/PuzzleHeader';
import Board from '../../components/features/Board';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList, TrainingPuzzle } from '../../components/types';
import { CustomText } from '../../components/common';

const TrainingPuzzleSolve = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'TrainingPuzzleSolve'>>();
  const [puzzleDetail, setPuzzleDetail] = useState<TrainingPuzzle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (route.params.puzzle?.id) {
      setPuzzleDetail(route.params.puzzle);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [route.params.puzzle]);

  if (isLoading) {
    return <Container />;
  }

  if (!puzzleDetail) {
    return (
      <Container>
        <CustomText color="gray/gray500">퍼즐 정보 가져오기 실패</CustomText>
      </Container>
    );
  }

  return (
    <Container>
      <HeaderWrapper>
        <PuzzleHeader
          title={puzzleDetail.title ?? puzzleDetail.id.toString()}
          depth={puzzleDetail.depth}
          winColor={puzzleDetail.winColor}
          displayNumber={puzzleDetail.id}
          isSolved={puzzleDetail.isSolved}
          isCommunityPuzzle={false}
        />
      </HeaderWrapper>

      <BoardWrapper>
        <Board
          mode="solve"
          sequence={puzzleDetail.boardStatus}
          setSequence={() => {}}
          setIsWin={() => {}}
          setIsLoading={() => {}}
          winDepth={puzzleDetail.depth}
        />
      </BoardWrapper>
    </Container>
  );
};

export default TrainingPuzzleSolve;
