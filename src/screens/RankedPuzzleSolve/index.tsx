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

const RankedPuzzleSolve = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const {
    isModalVisible,
    activateModal,
    closePrimarily,
    closeSecondarily,
    category: modalCategory,
  } = useModal();
  const [isLoading, setIsLoading] = useState<boolean | null>(null);
  const [results, setResults] = useState<GameResult[]>([]);
  const [outcome, setOutcome] = useState<GameOutcome>();
  const [boardStatus, setBoardStatus] = useState<string>('');
  const [bonusTrigger, setBonusTrigger] = useState(0);

  useEffect(() => {
    const initializeGame = async () => {
      try {
        setIsLoading(true);
        const initialData = await startRankingGame();
        setBoardStatus(initialData.boardStatus);
      } catch (error) {
        showBottomToast('error', error as string);
        console.error('게임 시작 실패', error);
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
    setBoardStatus(data.boardStatus);
    setResults((prev) => [...prev, { variant: result ? 'success' : 'error' }]);
    setIsLoading(false);
  };

  const handleFinish = async () => {
    const data = await finishRankingGame();
    setOutcome(data);
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

        {!!boardStatus && (
          <Board
            mode="solve"
            sequence={boardStatus}
            setSequence={() => {}}
            setIsWin={handleResult}
            setIsLoading={setIsLoading}
            winDepth={225}
          />
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
