import React from 'react';
import { Text } from 'react-native';
import PuzzleListCard from '../../../components/features/PuzzleListCard';
import { CardsContainer } from './index.styles';

const CommunityPuzzleList = () => {
  return (
    <CardsContainer>
      <PuzzleListCard
        title="흑선승 VCF"
        author="isoo"
        description="해결 130 | 정답률 86%"
        bottom={() => (
          <Text>No.1329</Text>
        )}
        isLocked={false}
      />
      <PuzzleListCard
        title="백선승 VCF"
        author="isoo"
        description="해결 13 | 정답률 66%"
        bottom={() => (
          <Text>No.1329</Text>
        )}
        isLocked={false}
      />
    </CardsContainer>
  );
};

export default CommunityPuzzleList;
