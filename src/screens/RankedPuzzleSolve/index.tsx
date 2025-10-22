import React, { useCallback, useEffect, useRef, useState } from 'react';
import RankingResultButton from '../../components/features/RankingResultButton';
import TimerWithProgressBar from '../../components/features/TimerWithProgressBar';
import {
  BoardFooterWrapper,
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
import { ParamListBase, useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GameOutcome, GameResult } from '../../types';
import { showBottomToast } from '../../components/common/Toast/toastMessage';
import PuzzleAttributes from '../../components/features/PuzzleAttributes';
import { useUserStore } from '../../store/useUserStore';
import { ScrollView } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import { BackHandler, Platform, ToastAndroid } from 'react-native';
import PuzzleActionButton from '../../components/features/PuzzleActionButton';

interface PuzzleData {
  boardStatus: string;
  winColor: 'BLACK' | 'WHITE';
}

const RankedPuzzleSolve = () => {
  const backHandlerPressedOnce = useRef(false);
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const {
    isModalVisible,
    activateModal,
    closePrimarily,
    closeSecondarily,
    category: modalCategory,
  } = useModal();
  const { updateUser } = useUserStore();
  const scrollRef = useRef<ScrollView>(null);
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
      showBottomToast('success', t('modal.rankingPuzzleSuccess.message'));
    } else {
      showBottomToast('error', t('modal.puzzleFailure.message'));
    }

    try {
      const data = await submitRankingGameResult(result);
      setPuzzleData(data);
      setResults((prev) => [...prev, { variant: result ? 'success' : 'error' }]);
    } catch (error) {
      showBottomToast('error', error as string);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollToEnd({ animated: true });
    }
  }, [results]);

  const handleFinish = async () => {
    try {
      const data = await finishRankingGame();
      setOutcome(data);
      updateUser();
      activateModal('RANKING_PUZZLE_OUTRO', {
        primaryAction: () => {
          navigation.navigate('Home');
        },
        secondaryAction: () => {
          // TODO: 복습 화면으로 이동
          activateModal('FEATURE_IN_PROGRESS', { primaryAction: () => {} });
        },
      });
    } catch (error) {
      showBottomToast('error', error as string);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') {
        return;
      }

      const onBackPress = () => {
        if (backHandlerPressedOnce.current) {
          navigation.goBack();
          return true;
        }

        backHandlerPressedOnce.current = true;
        ToastAndroid.show('한 번 더 누르면 종료됩니다.', ToastAndroid.SHORT);

        setTimeout(() => {
          backHandlerPressedOnce.current = false;
        }, 2000);

        // 기본 뒤로가기 동작 막기
        return true;
      };

      // 리스너 등록
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      // 화면이 포커스를 잃을 때 리스너 제거
      return () => subscription.remove();
    }, [navigation]),
  );

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
          ref={scrollRef}
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
            <BoardFooterWrapper>
              <PuzzleAttributes depth={null} winColor={puzzleData.winColor} />
              <PuzzleActionButton mode="giveUp" onPress={() => handleResult(false)} />
            </BoardFooterWrapper>
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
