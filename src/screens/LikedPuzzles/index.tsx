import React, { useCallback, useState } from 'react';
import { Container } from './index.styles';
import InfiniteScrollList from '../../components/common/InfiniteScrollList';
import { CommunityPuzzle } from '../../components/types';
import { getLikedPuzzles } from '../../apis/user';
import CommunityCard from '../../components/features/CommunityCard';
import { ParamListBase, useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const LikedPuzzles = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [refreshKey, setRefreshKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      // list refresh
      setRefreshKey((prev) => prev + 1);
    }, []),
  );

  return (
    <Container>
      <InfiniteScrollList<CommunityPuzzle>
        key={refreshKey}
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
            onPress={() => navigation.navigate('CommunityPuzzleSolve', { puzzle: item })}
          />
        )}
        keyExtractor={(item) => item && item.id.toString()}
      />
    </Container>
  );
};

export default LikedPuzzles;
