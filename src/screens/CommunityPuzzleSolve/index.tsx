/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
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
import Board from '../../components/features/Board';
import LikeDislikeToggle from '../../components/features/LikeDislikeToggle';
import { ReactionType } from '../../components/types/Community';
import { showBottomToast } from '../../components/common/Toast/toastMessage';
import {
  getCommunityPuzzle,
  openCommunityAnswer,
  solveCommunityPuzzle,
  updateDislike,
  updateLike,
} from '../../apis/community';
import { ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { CommunityPuzzle, RootStackParamList } from '../../components/types';
import { ActivityIndicator } from 'react-native';
import theme from '../../styles/theme';
import useModal from '../../hooks/useModal';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useUserStore } from '../../store/useUserStore';

const CommunityPuzzleSolve = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<RootStackParamList, 'CommunityPuzzleSolve'>>();
  const {
    isModalVisible,
    activateModal,
    closePrimarily,
    closeSecondarily,
    category: modalCategory,
  } = useModal();
  const { updateUser } = useUserStore();
  const [puzzleDetail, setPuzzleDetail] = useState<CommunityPuzzle | null>(route.params.puzzle);
  const [isLoading, setIsLoading] = useState(true);
  const [boardKey, setBoardKey] = useState(0);

  const handleResult = async (result: boolean | null) => {
    if (result === null || !puzzleDetail) {
      return;
    }
    if (result) {
      await solveCommunityPuzzle(puzzleDetail.id);

      activateModal('COMMUNITY_PUZZLE_SUCCESS', {
        primaryAction: () => {
          navigation.goBack();
        },
      });
    } else {
      activateModal('PUZZLE_FAILURE', {
        primaryAction: async () => {
          navigation.goBack();
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
      console.error(error);
      showBottomToast('error', error as string);
    }
  };

  const handleRetry = () => {
    setBoardKey((prevKey) => prevKey + 1);
  };

  const handleShowAnswer = () => {
    if (isLoading || !puzzleDetail?.id) {
      return;
    }

    const openAnswer = async () => {
      setIsLoading(true);
      try {
        const data = await openCommunityAnswer(puzzleDetail.id);
        const problemSequence = puzzleDetail.boardStatus;
        const mainSequence = problemSequence + data.answer;

        await updateUser();
        showBottomToast('success', '구매가 완료되었습니다.');
        navigation.navigate('CommunityPuzzleReview', {
          problemSequence,
          mainSequence,
        });
      } catch (error) {
        console.error('정답 보기 처리 중 오류 발생:', error);
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
        <ActivityIndicator color={theme.color['main_color/yellow_p']} />
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
          mode="solve"
          sequence={puzzleDetail.boardStatus}
          setSequence={() => {}}
          setIsWin={handleResult}
          setIsLoading={setIsLoading}
          winDepth={225}
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
        gameOutcome={{ price: 100 }}
        isLoading={isLoading}
      />
    </Container>
  );
};

export default CommunityPuzzleSolve;
