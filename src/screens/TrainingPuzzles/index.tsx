/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { RootStackParamList, TrainingPuzzle } from '../../components/types';
import { Container } from './index.styles';
import TrainingCard from '../../components/features/TrainingCard';
import { getTrainingPuzzles } from '../../apis/training';
import { showBottomToast } from '../../components/common/Toast/toastMessage';
import { ActivityIndicator, FlatList, View } from 'react-native';

const TrainingPuzzles = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'TrainingPuzzles'>>();
  const { packId } = route.params;
  const [puzzles, setPuzzless] = useState<TrainingPuzzle[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPuzzleData = async () => {
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
    fetchPuzzleData();
  }, []);

  return (
    <Container>
      {loading ? (
        <ActivityIndicator style={{ marginVertical: 16 }} />
      ) : (
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
              onPress={() => {}}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
      )}
    </Container>
  );
};

export default TrainingPuzzles;
