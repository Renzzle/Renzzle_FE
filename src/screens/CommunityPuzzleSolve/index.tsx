/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import {
  BoardReactionWrapper,
  BoardStatsWrapper,
  BoardWrapper,
  Container,
  DescriptionWrapper,
  HeaderWrapper,
} from './index.styles';
import PuzzleHeader from '../../components/features/PuzzleHeader';
import { CustomModal, CustomText } from '../../components/common';
import PuzzleStats from '../../components/features/PuzzleStats';
import Board, { BoardRef } from '../../components/features/Board';
import LikeDislikeToggle from '../../components/features/LikeDislikeToggle';
import { showBottomToast } from '../../components/common/Toast/toastMessage';
import {
  getCommunityPuzzle,
  openCommunityAnswer,
  solveCommunityPuzzle,
  updateDislike,
  updateLike,
} from '../../apis/community';
import { ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
  CommunityPuzzle,
  CommunityPuzzlePatch,
  ReactionType,
  RootStackParamList,
  TrainingPuzzleReviewAction,
} from '../../types';
import { ActivityIndicator } from 'react-native';
import theme from '../../styles/theme';
import useModal from '../../hooks/useModal';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useUserStore } from '../../store/useUserStore';
import { usePuzzleAd } from '../../hooks/usePuzzleAd';
import { useTranslation } from 'react-i18next';
import usePuzzleReviewNavigation from '../../hooks/usePuzzleReviewNavigation';
import ReviewButton from '../../components/features/ReviewButton';

const CommunityPuzzleSolve = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<RootStackParamList, 'CommunityPuzzleSolve'>>();
  const {
    isModalVisible,
    activateModal,
    closeModal,
    closePrimarily,
    closeSecondarily,
    category: modalCategory,
  } = useModal();
  const { updateUser } = useUserStore();
  const { fromScreen = 'CommunityPuzzles' } = route.params;
  const { navigateToCommunityPuzzleReview } = usePuzzleReviewNavigation();
  const [puzzleDetail, setPuzzleDetail] = useState<CommunityPuzzle | null>(route.params.puzzle);
  const [currentSequence, setCurrentSequence] = useState(puzzleDetail?.boardStatus ?? '');
  const [isLoading, setIsLoading] = useState(true);
  const [boardKey, setBoardKey] = useState(0);
  const puzzleDetailRef = useRef(puzzleDetail);
  const boardRef = useRef<BoardRef>(null);

  const isPuzzleResultModal =
    modalCategory === 'COMMUNITY_PUZZLE_SUCCESS' || modalCategory === 'COMMUNITY_PUZZLE_FAILURE';

  const reviewAction: TrainingPuzzleReviewAction | undefined =
    modalCategory === 'COMMUNITY_PUZZLE_SUCCESS'
      ? 'complete'
      : modalCategory === 'COMMUNITY_PUZZLE_FAILURE'
        ? 'retry'
        : undefined;

  const shouldShowReviewButton =
    isPuzzleResultModal &&
    !!puzzleDetail &&
    currentSequence.length > puzzleDetail.boardStatus.length;

  const { showAdIfReady } = usePuzzleAd();

  const markSolved = () => {
    setPuzzleDetail((prev) => {
      if (!prev) {
        return prev;
      }
      return { ...prev, isSolved: true };
    });
  };

  const handleResult = async (result: boolean | null) => {
    if (result === null || !puzzleDetail) {
      return;
    }
    if (result) {
      await solveCommunityPuzzle(puzzleDetail.id);

      markSolved();

      activateModal('COMMUNITY_PUZZLE_SUCCESS', {
        primaryAction: () => {
          showAdIfReady(() => {
            navigation.goBack();
          });
        },
      });
    } else {
      activateModal('COMMUNITY_PUZZLE_FAILURE', {
        primaryAction: async () => {
          navigation.goBack();
        },
        secondaryAction: () => {
          handleRetry();
        },
      });
    }
  };

  const handleReactionChange = async (newReaction: ReactionType) => {
    if (isLoading) {
      return;
    }

    setPuzzleDetail((prev) => {
      if (!prev) {
        return null;
      }

      const oldReaction = prev.myLike ? 'like' : prev.myDislike ? 'dislike' : null;
      let newLikeCount = prev.likeCount;

      if (oldReaction === 'like' && newReaction !== 'like') {
        newLikeCount--;
      } else if (oldReaction !== 'like' && newReaction === 'like') {
        newLikeCount++;
      }

      // Optimistic update (apply UI changes first)
      return {
        ...prev,
        likeCount: newLikeCount,
        myLike: newReaction === 'like',
        myDislike: newReaction === 'dislike',
      };
    });

    if (!puzzleDetail?.id) {
      return;
    }

    try {
      if (newReaction === 'like' || (puzzleDetail.myLike && newReaction === null)) {
        await updateLike(puzzleDetail.id);
      } else if (newReaction === 'dislike' || (puzzleDetail.myDislike && newReaction === null)) {
        await updateDislike(puzzleDetail.id);
      }
    } catch (error) {
      showBottomToast('error', error as string);
    }
  };

  const handleRetry = () => {
    boardRef.current?.cancelAiTurn();
    if (puzzleDetail) {
      setCurrentSequence(puzzleDetail.boardStatus);
    }
    setBoardKey((prevKey) => prevKey + 1);
  };

  const handleReviewPress = (
    answer = currentSequence.slice(puzzleDetail?.boardStatus.length),
    backBehavior?: 'popTwo',
    nextReviewAction?: TrainingPuzzleReviewAction,
  ) => {
    if (!puzzleDetail || !answer) {
      return;
    }

    closeModal();

    navigateToCommunityPuzzleReview({
      puzzle: puzzleDetail,
      answer,
      backBehavior,
      reviewAction: nextReviewAction,
    });
  };

  const handleViewAnswerPress = (answer: string) => {
    if (!puzzleDetail || !answer) {
      return;
    }

    navigateToCommunityPuzzleReview({
      puzzle: puzzleDetail,
      answer,
      destination: 'viewAnswer',
    });
  };

  const handleShowAnswer = () => {
    if (!puzzleDetail?.id) {
      return;
    }

    const openAnswer = async () => {
      setIsLoading(true);
      try {
        const data = await openCommunityAnswer(puzzleDetail.id);

        markSolved();

        await updateUser();
        boardRef.current?.cancelAiTurn();
        showBottomToast('success', t('toast.purchaseComplete'));
        handleViewAnswerPress(data.answer);
      } catch (error) {
        showBottomToast('error', error as string);
      } finally {
        setIsLoading(false);
      }
    };

    activateModal('PUZZLE_REVIEW_PURCHASE', {
      primaryAction: openAnswer,
    });
  };

  useEffect(() => {
    puzzleDetailRef.current = puzzleDetail;
  }, [puzzleDetail]);

  useEffect(() => {
    if (puzzleDetail?.boardStatus) {
      setCurrentSequence(puzzleDetail.boardStatus);
    }
  }, [puzzleDetail?.boardStatus]);

  useEffect(() => {
    const currentReviewAction = route.params.reviewAction;

    if (!currentReviewAction) {
      return;
    }

    navigation.setParams({ reviewAction: undefined });

    if (currentReviewAction === 'complete') {
      navigation.goBack();
      return;
    }

    if (currentReviewAction === 'retry') {
      handleRetry();
    }
  }, [route.params.reviewAction]);

  useEffect(() => {
    return () => {
      const lastDetail = puzzleDetailRef.current;

      if (!lastDetail) {
        return;
      }

      navigation.navigate(fromScreen, {
        updatedItem: {
          id: lastDetail.id,
          likeCount: lastDetail.likeCount,
          views: lastDetail.views,
          isSolved: lastDetail.isSolved,
        } satisfies CommunityPuzzlePatch,
      });
    };
  }, []);

  useEffect(() => {
    const getDetail = async () => {
      if (!route.params.puzzle?.id) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        if (puzzleDetail) {
          const data = await getCommunityPuzzle(route.params.puzzle.id);

          setPuzzleDetail((prev) => ({
            ...prev,
            ...data,
          }));
          console.log('puzzle 디테일:', puzzleDetail);
        }
      } catch (error) {
        showBottomToast('error', error as string);
      } finally {
        setIsLoading(false);
      }
    };

    getDetail();
  }, [route.params.puzzle.id]);

  if (!puzzleDetail) {
    return (
      <Container>
        <ActivityIndicator color={theme.color['gray/gray300']} />
      </Container>
    );
  }

  return (
    <Container>
      <HeaderWrapper>
        <PuzzleHeader
          title={puzzleDetail.authorName}
          depth={puzzleDetail.depth}
          winColor={puzzleDetail.winColor}
          isVerified={puzzleDetail.isVerified}
          isSolved={puzzleDetail.isSolved}
          isCommunityPuzzle
          handleRetry={handleRetry}
          handleShowAnswer={handleShowAnswer}
        />
        <DescriptionWrapper>
          <CustomText size={12} lineHeight="lg" color="gray/gray600">
            {puzzleDetail.description}
          </CustomText>
        </DescriptionWrapper>
      </HeaderWrapper>

      <BoardWrapper>
        <BoardStatsWrapper>
          <PuzzleStats
            puzzleId={puzzleDetail.id}
            solvedCount={puzzleDetail.solvedCount}
            views={puzzleDetail.views}
            showIconLabel
          />
        </BoardStatsWrapper>
        <Board
          key={boardKey}
          ref={boardRef}
          mode="solve"
          sequence={puzzleDetail.boardStatus}
          setSequence={setCurrentSequence}
          setIsWin={handleResult}
          puzzleCache={{ puzzleType: 'COMMUNITY', puzzleId: puzzleDetail.id }}
        />
        <BoardReactionWrapper>
          <LikeDislikeToggle
            value={puzzleDetail.myLike ? 'like' : puzzleDetail.myDislike ? 'dislike' : null}
            likeCount={puzzleDetail.likeCount}
            onChange={handleReactionChange}
          />
        </BoardReactionWrapper>
      </BoardWrapper>

      <CustomModal
        isVisible={isModalVisible}
        category={modalCategory}
        onPrimaryAction={closePrimarily}
        onSecondaryAction={closeSecondarily}
        titleRight={
          shouldShowReviewButton && reviewAction ? (
            <ReviewButton onPress={() => handleReviewPress(undefined, 'popTwo', reviewAction)}>
              {t('puzzle.review')}
            </ReviewButton>
          ) : undefined
        }
        gameOutcome={{ price: 100 }}
        isLoading={isLoading}
      />
    </Container>
  );
};

export default CommunityPuzzleSolve;
