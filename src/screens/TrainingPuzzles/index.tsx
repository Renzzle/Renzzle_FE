/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */

import { ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { RootStackParamList, TrainingPuzzle } from '../../components/types';
import { Container } from './index.styles';
import TrainingCard from '../../components/features/TrainingCard';
import { getTrainingPuzzles } from '../../apis/training';
import { showBottomToast } from '../../components/common/Toast/toastMessage';
import { ActivityIndicator, FlatList, View } from 'react-native';
import PackCard from '../../components/features/PackCard';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const TrainingPuzzles = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const route = useRoute<RouteProp<RootStackParamList, 'TrainingPuzzles'>>();
  const { pack } = route.params;
  const [puzzles, setPuzzless] = useState<TrainingPuzzle[]>([]);
  const [loading, setLoading] = useState(true);

  const navigateToTrainingDetail = (puzzle: TrainingPuzzle, index: number) => {
    navigation.navigate('TrainingPuzzleSolve', {
      puzzle: { ...puzzle, title: pack.title, index: index },
    });
  };

  const fetchPuzzleData = async (packId: number) => {
    setLoading(true);
    try {
      const data = await getTrainingPuzzles(packId);
      setPuzzless(data);
    } catch (error) {
      showBottomToast('error', error as string);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pack && pack.id) {
      fetchPuzzleData(pack.id);
    }
  }, [pack]);

  return (
    <Container>
      {loading ? (
        <ActivityIndicator style={{ marginVertical: 16 }} />
      ) : (
        <>
          <PackCard
            title={pack.title}
            author={pack.author}
            description={pack.description}
            price={pack.price}
            totalPuzzleCount={pack.totalPuzzleCount}
            solvedPuzzleCount={pack.solvedPuzzleCount}
            isLocked={false}
            variant="minimal"
            onPress={() => {}}
          />
          <FlatList
            data={puzzles}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            renderItem={({ item, index }) => (
              <TrainingCard
                title={(index + 1).toString()}
                sequence={item.boardStatus}
                depth={item.depth}
                winColor={item.winColor}
                isSolved={item.isSolved}
                onPress={() => navigateToTrainingDetail(item, index + 1)}
              />
            )}
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
