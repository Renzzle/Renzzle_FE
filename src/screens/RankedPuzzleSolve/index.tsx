import React, { useCallback, useEffect, useRef, useState } from 'react';
import RankingCounter from '../../components/features/RankingCounter';
import TimerWithProgressBar from '../../components/features/TimerWithProgressBar';
import {
  BoardWrapper,
  BottomActionsWrapper,
  Container,
  CounterSlot,
  CurrentPuzzleWrapper,
  HeaderWrapper,
  ProgressBarContainer,
  StatusHeaderWrapper,
} from './index.styles';
import Board from '../../components/features/Board';
import {
  finishRankingGame,
  getMyRating,
  startRankingGame,
  submitRankingGameResult,
} from '../../apis/rank';
import { CustomModal, CustomText } from '../../components/common';
import useModal from '../../hooks/useModal';
import { ParamListBase, useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GameOutcome, GameResult } from '../../types';
import { showBottomToast } from '../../components/common/Toast/toastMessage';
import PuzzleAttributes from '../../components/features/PuzzleAttributes';
import { useUserStore } from '../../store/useUserStore';
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
  const [isLoading, setIsLoading] = useState<boolean | null>(null);
  const [results, setResults] = useState<GameResult[]>([]);
  const [puzzleData, setPuzzleData] = useState<PuzzleData>();
  const [bonusTrigger, setBonusTrigger] = useState(0);
  const [shouldFinish, setShouldFinish] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const isFinishingRef = useRef(false);
  // 게임 시작 직전 레이팅. 종료 시 변동치(delta)를 프론트에서 계산하기 위해 보관
  const startRatingRef = useRef<number | null>(null);

  const successCount = results.filter((result) => result.variant === 'success').length;
  const failureCount = results.length - successCount;
  const currentPuzzleNumber = results.length + 1;

  useEffect(() => {
    const fetchStartRating = async () => {
      try {
        const data = await getMyRating();
        startRatingRef.current = data?.rating ?? null;
      } catch (error) {
        // 시작 레이팅을 못 받아도 게임 진행에는 지장 없음 (결과 화면에서 변동치만 미표시)
        startRatingRef.current = null;
      }
    };

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

    fetchStartRating();
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
      showBottomToast('error', t('modal.rankingPuzzleFailure.message'));
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

  const handleFinish = useCallback(async () => {
    // 조기 종료 후 타이머가 0초에 도달해도 이중 정산되지 않도록 가드
    if (isFinishingRef.current) {
      return;
    }
    isFinishingRef.current = true;

    try {
      const data: GameOutcome = await finishRankingGame();
      setIsGameFinished(true);
      await updateUser();

      const ratingDelta =
        startRatingRef.current !== null && data.rating !== undefined
          ? data.rating - startRatingRef.current
          : undefined;

      navigation.replace('RankedGameResult', {
        rating: data.rating,
        reward: data.reward,
        ratingDelta,
      });
    } catch (error) {
      isFinishingRef.current = false;
      showBottomToast('error', error as string);
    }
  }, [navigation, updateUser]);

  // 종료 확인 모달이 닫힌 뒤에 게임을 정산해야 결과 모달이 바로 닫히지 않는다
  useEffect(() => {
    if (!shouldFinish) {
      return;
    }
    setShouldFinish(false);
    handleFinish();
  }, [shouldFinish, handleFinish]);

  const handleEndGamePress = () => {
    activateModal('RANKING_GAME_END_CONFIRM', {
      primaryAction: () => {
        setShouldFinish(true);
      },
      secondaryAction: () => {},
    });
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
      <HeaderWrapper>
        <ProgressBarContainer>
          <TimerWithProgressBar
            start={true}
            paused={!!isLoading || isGameFinished}
            onFinish={handleFinish}
            bonusTimeTrigger={bonusTrigger}
          />
        </ProgressBarContainer>

        <StatusHeaderWrapper>
          <CounterSlot align="left">
            <RankingCounter variant="success" count={successCount} />
          </CounterSlot>
          <CurrentPuzzleWrapper>
            <CustomText size={20} weight="bold" lineHeight="sm" color="gray/black">
              #{currentPuzzleNumber}
            </CustomText>
            {!!puzzleData && <PuzzleAttributes depth={null} winColor={puzzleData.winColor} />}
          </CurrentPuzzleWrapper>
          <CounterSlot align="right">
            <RankingCounter variant="error" count={failureCount} />
          </CounterSlot>
        </StatusHeaderWrapper>
      </HeaderWrapper>

      <BoardWrapper>
        {!!puzzleData && (
          <Board
            mode="solve"
            sequence={puzzleData.boardStatus}
            setSequence={() => {}}
            setIsWin={handleResult}
            setIsLoading={setIsLoading}
          />
        )}
      </BoardWrapper>

      <BottomActionsWrapper>
        <PuzzleActionButton mode="endGame" disabled={!!isLoading} onPress={handleEndGamePress} />
        <PuzzleActionButton mode="skip" disabled={!!isLoading} onPress={() => handleResult(false)} />
      </BottomActionsWrapper>

      <CustomModal
        isVisible={isModalVisible}
        category={modalCategory}
        onPrimaryAction={closePrimarily}
        onSecondaryAction={closeSecondarily}
      />
    </Container>
  );
};

export default RankedPuzzleSolve;
