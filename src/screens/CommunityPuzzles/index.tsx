import React from 'react';
import { Container } from './index.styles';
import InfiniteScrollList from '../../components/common/InfiniteScrollList';
import { CommunityPuzzle } from '../../components/types';
import { getCommunityPuzzles } from '../../apis/community';
import CommunityCard from '../../components/features/CommunityCard';

const CommunityPuzzles = () => {
  return (
    <Container>
      <InfiniteScrollList<CommunityPuzzle>
        apiCall={getCommunityPuzzles}
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

export default CommunityPuzzles;
