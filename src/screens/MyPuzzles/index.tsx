import React from 'react';
import InfiniteScrollList from '../../components/common/InfiniteScrollList';
import { getUserPuzzles } from '../../apis/user';
import CommunityCard from '../../components/features/CommunityCard';
import { CommunityPuzzle } from '../../components/types';
import { Container } from './index.styles';

const MyPuzzles = () => {
  return (
    <Container>
      <InfiniteScrollList<CommunityPuzzle>
        apiCall={({ id, size }) => getUserPuzzles(id, size)}
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
            onDelete={() => {}}
          />
        )}
        keyExtractor={(item) => item && item.id.toString()}
      />
    </Container>
  );
};

export default MyPuzzles;
