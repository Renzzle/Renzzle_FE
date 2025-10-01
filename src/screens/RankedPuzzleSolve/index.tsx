import React, { useEffect, useState } from 'react';
import RankingResultButton from '../../components/features/RankingResultButton';
import TimerWithProgressBar from '../../components/features/TimerWithProgressBar';
import {
  BoardWrapper,
  Container,
  HorizontalScrollContainer,
  ProgressBarContainer,
  RankingResultButtonWrapper,
} from './index.styles';
import Board from '../../components/features/Board';
import { finishRankingGame, startRankingGame, submitRankingGameResult } from '../../apis/rank';
import { CustomModal } from '../../components/common';
import useModal from '../../hooks/useModal';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GameOutcome, GameResult } from '../../components/types/Ranking';
import { showBottomToast } from '../../components/common/Toast/toastMessage';
import PuzzleAttributes from '../../components/features/PuzzleAttributes';
import { useUserStore } from '../../store/useUserStore';

interface PuzzleData {
  boardStatus: string;
  winColor: 'BLACK' | 'WHITE';
}

const RankedPuzzleSolve = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const {
    isModalVisible,
    activateModal,
    closePrimarily,
    closeSecondarily,
    category: modalCategory,
  } = useModal();
  const { updateUser } = useUserStore();
  const [isLoading, setIsLoading] = useState<boolean | null>(null);
  const [results, setResults] = useState<GameResult[]>([]);
  const [outcome, setOutcome] = useState<GameOutcome>();
  const [puzzleData, setPuzzleData] = useState<PuzzleData>();
  const [bonusTrigger, setBonusTrigger] = useState(0);

  useEffect(() => {
    const initializeGame = async () => {
      try {
        setIsLoading(true);
        const initialData = await startRankingGame();
        setPuzzleData(initialData);
      } catch (error) {
        showBottomToast('error', error as string);
      } finally {
        setIsLoading(false);
      }
    };

    initializeGame();
  }, []);

  const handleResult = async (result: boolean | null) => {
    if (result === null) {
      return;
    }
    if (result) {
      setBonusTrigger((prev) => prev + 1);
    }

    const data = await submitRankingGameResult(result);
    setPuzzleData(data);
    setResults((prev) => [...prev, { variant: result ? 'success' : 'error' }]);
    setIsLoading(false);
  };

  const handleFinish = async () => {
    const data = await finishRankingGame();
    setOutcome(data);
    updateUser();
    activateModal('RANKING_PUZZLE_OUTRO', {
      primaryAction: () => {
        navigation.navigate('Home');
      },
      secondaryAction: () => {
        // TODO: 복습 화면으로 이동
      },
    });
  };

  return (
    <Container>
      <ProgressBarContainer>
        <TimerWithProgressBar
          start={true}
          paused={!!isLoading}
          onFinish={handleFinish}
          bonusTimeTrigger={bonusTrigger}
        />
      </ProgressBarContainer>

      <BoardWrapper>
        <HorizontalScrollContainer
          horizontal={true}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <RankingResultButtonWrapper>
            {results.map((result, index) => (
              <RankingResultButton
                key={index}
                variant={result.variant}
                text={String(index + 1)}
                disabled
              />
            ))}
          </RankingResultButtonWrapper>
        </HorizontalScrollContainer>

        {!!puzzleData && (
          <>
            <Board
              mode="solve"
              sequence={puzzleData.boardStatus}
              setSequence={() => {}}
              setIsWin={handleResult}
              setIsLoading={setIsLoading}
              winDepth={225}
            />
            <PuzzleAttributes depth={null} winColor={puzzleData.winColor} />
          </>
        )}
      </BoardWrapper>

      <CustomModal
        isVisible={isModalVisible}
        category={modalCategory}
        onPrimaryAction={closePrimarily}
        onSecondaryAction={closeSecondarily}
        gameOutcome={outcome}
      />
    </Container>
  );
};

export default RankedPuzzleSolve;
