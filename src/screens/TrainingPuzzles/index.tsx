/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */

import { ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RootStackParamList, TrainingPack, TrainingPuzzle } from '../../types';
import { Container } from './index.styles';
import TrainingCard from '../../components/features/TrainingCard';
import { getTrainingPuzzles } from '../../apis/training';
import { showBottomToast } from '../../components/common/Toast/toastMessage';
import { ActivityIndicator, FlatList, View } from 'react-native';
import PackCard from '../../components/features/PackCard';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import theme from '../../styles/theme';

const TrainingPuzzles = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<RootStackParamList, 'TrainingPuzzles'>>();
  const { pack } = route.params;

  const [puzzles, setPuzzles] = useState<TrainingPuzzle[]>([]);
  const [loading, setLoading] = useState(true);

  const solvedCount = useMemo(() => puzzles.filter((puzzle) => puzzle.isSolved).length, [puzzles]);
  const solvedCountRef = useRef(solvedCount);
  useEffect(() => {
    solvedCountRef.current = solvedCount;
  }, [solvedCount]);

  const fetchPuzzleData = useCallback(async (packId: number) => {
    setLoading(true);
    try {
      const data = await getTrainingPuzzles(packId);
      setPuzzles(data);
    } catch (error) {
      showBottomToast('error', error as string);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data on initial mount
  useEffect(() => {
    if (pack && pack.id) {
      fetchPuzzleData(pack.id);
    }
  }, [fetchPuzzleData, pack, pack.id]);

  // Optimistic update
  useEffect(() => {
    const updatedItems = route.params?.updatedItems;

    if (updatedItems && updatedItems.length > 0) {
      setPuzzles((prevPuzzles) =>
        prevPuzzles.map((prevPuzzle) => {
          const updatedTarget = updatedItems.find((item) => item.id === prevPuzzle.id);
          return updatedTarget ? { ...prevPuzzle, ...updatedTarget } : prevPuzzle;
        }),
      );

      navigation.setParams({ updatedItems: undefined });
    }
  }, [route.params?.updatedItems, navigation]);

  useEffect(() => {
    return () => {
      if (solvedCountRef.current !== pack.solvedPuzzleCount) {
        const updatedPack: TrainingPack = {
          ...pack,
          solvedPuzzleCount: solvedCountRef.current,
        };

        navigation.navigate('TrainingPacks', {
          updatedPack,
        });
      }
    };
  }, [pack, navigation]);

  const navigateToTrainingDetail = useCallback(
    (puzzleNumber: number) => {
      navigation.navigate('TrainingPuzzleSolve', {
        puzzles: puzzles,
        pack: pack,
        puzzleNumber: puzzleNumber,
      });
    },
    [navigation, pack, puzzles],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: TrainingPuzzle; index: number }) => (
      <TrainingCard
        title={(index + 1).toString()}
        sequence={item.boardStatus}
        depth={item.depth}
        winColor={item.winColor}
        isSolved={item.isSolved}
        onPress={() => navigateToTrainingDetail(index + 1)}
      />
    ),
    [navigateToTrainingDetail],
  );

  return (
    <Container>
      {loading ? (
        <ActivityIndicator color={theme.color['gray/gray300']} style={{ marginVertical: 16 }} />
      ) : (
        <>
          <PackCard
            title={pack.title}
            author={pack.author}
            description={pack.description}
            price={pack.price}
            totalPuzzleCount={pack.totalPuzzleCount}
            solvedPuzzleCount={solvedCount}
            isLocked={false}
            variant="minimal"
            onPress={() => {}}
          />
          <FlatList
            data={puzzles}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
        </>
      )}
    </Container>
  );
};

export default TrainingPuzzles;
