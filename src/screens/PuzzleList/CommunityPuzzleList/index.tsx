import React from 'react';
import PuzzleListCard from '../../../components/features/PuzzleListCard';
import { CardsContainer } from './index.styles';
import TagSmall from '../../../components/common/TagSmall';

const CommunityPuzzleList = () => {
  return (
    <CardsContainer>
      <PuzzleListCard
        title="흑선승 VCF"
        author="isoo"
        description="해결 130 | 정답률 86%"
        bottom={() => (
          <TagSmall>No.1329</TagSmall>
        )}
        isLocked={false}
      />
      <PuzzleListCard
        title="백선승 VCF"
        author="isoo"
        description="해결 13 | 정답률 66%"
        bottom={() => (
          <TagSmall>No.1329</TagSmall>
        )}
        isLocked={false}
      />
    </CardsContainer>
  );
};

export default CommunityPuzzleList;
