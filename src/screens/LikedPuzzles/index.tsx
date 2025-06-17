import React from 'react';
import { Container } from './index.styles';
import InfiniteScrollList from '../../components/common/InfiniteScrollList';
import { CommunityPuzzle } from '../../components/types';
import { getLikedPuzzles } from '../../apis/user';
import CommunityCard from '../../components/features/CommunityCard';

const LikedPuzzles = () => {
  return (
    <Container>
      <InfiniteScrollList<CommunityPuzzle>
        apiCall={({ id, size }) => getLikedPuzzles(id, size)}
        renderItem={({ item }) => (
          <CommunityCard
            title={item.authorName}
            sequence={item.boardStatus}
            depth={item.depth}
            winColor={item.winColor}
            isVerified={item.isVerified}
            date={item.createdAt}
            puzzleId={item.id}
            views={item.views}
            solvedCount={item.solvedCount}
            likeCount={item.likeCount}
            isSolved={item.isSolved}
            onPress={() => {}}
          />
        )}
        keyExtractor={(item) => item && item.id.toString()}
      />
    </Container>
  );
};

export default LikedPuzzles;
