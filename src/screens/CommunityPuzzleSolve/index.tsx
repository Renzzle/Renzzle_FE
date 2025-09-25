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
import { CustomText } from '../../components/common';
import PuzzleStats from '../../components/features/PuzzleStats';
import Board from '../../components/features/Board';
import LikeDislikeToggle from '../../components/features/LikeDislikeToggle';
import { ReactionType } from '../../components/types/Community';
import { showBottomToast } from '../../components/common/Toast/toastMessage';
import { getCommunityPuzzle, updateDislike, updateLike } from '../../apis/community';
import { RouteProp, useRoute } from '@react-navigation/native';
import { CommunityPuzzle, RootStackParamList } from '../../components/types';

const CommunityPuzzleSolve = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'CommunityPuzzleSolve'>>();
  const [puzzleDetail, setPuzzleDetail] = useState<CommunityPuzzle | null>(route.params.puzzle);
  const [isLoading, setIsLoading] = useState(true);

  const handleReactionChange = async (newReaction: ReactionType) => {
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

  if (isLoading || !puzzleDetail) {
    return <Container />;
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
        />
        <DescriptionWrapper>
          <CustomText size={12} lineHeight="lg" color="gray/gray600">
            동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리 나라 만세 무궁화 삼천리 화려 강산
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
          mode="solve"
          sequence={puzzleDetail.boardStatus}
          setSequence={() => {}}
          setIsWin={() => {}}
          setIsLoading={() => {}}
          winDepth={puzzleDetail.depth}
        />
        <BoardReactionWrapper>
          <LikeDislikeToggle
            value={puzzleDetail.myLike ? 'like' : puzzleDetail.myDislike ? 'dislike' : null}
            likeCount={puzzleDetail.likeCount}
            onChange={handleReactionChange}
          />
        </BoardReactionWrapper>
      </BoardWrapper>
    </Container>
  );
};

export default CommunityPuzzleSolve;
