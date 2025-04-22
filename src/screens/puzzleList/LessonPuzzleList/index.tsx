/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState } from 'react';
import { CardsContainer, PuzzleListContainer } from './index.styles';
import PuzzleListCard from '../../../components/features/PuzzleListCard';
import useAuthStore from '../../../store/useAuthStore';
import {
  ParamListBase,
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getLessonPuzzle } from '../../../apis/lesson';
import { toDifficultyEnum, toWinColorEnum } from '../../../utils/utils';
import CustomText from '../../../components/common/CustomText';
import { ScrollView } from 'react-native';
import { LessonPuzzleListResponse, RootStackParamList } from '../../../components/features/types';

const LessonPuzzleList = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<RootStackParamList, 'LessonPuzzleList'>>();
  const [puzzleList, setPuzzleList] = useState<LessonPuzzleListResponse>();
  const { accessToken } = useAuthStore();
  const { chapter } = route.params;

  useFocusEffect(
    useCallback(() => {
      const loadPuzzleList = async () => {
        if (accessToken === undefined) {
          alert('accesstoken 없음');
          navigation.navigate('Signin');
        } else {
          try {
            const data = await getLessonPuzzle(accessToken, chapter, 100);
            setPuzzleList(data);
          } catch (error) {
            throw error;
          }
        }
      };
      loadPuzzleList();

      return () => {};
    }, [accessToken, navigation]),
  );

  return (
    <PuzzleListContainer>
      <ScrollView>
        <CardsContainer>
          {puzzleList?.isSuccess &&
            puzzleList.response.map((puzzle) => {
              return (
                <PuzzleListCard
                  key={puzzle.id}
                  title={puzzle.title}
                  author="Renzzle"
                  description={`깊이 ${puzzle.depth} • 난이도 ${toDifficultyEnum(
                    puzzle.difficulty,
                  )} • ${toWinColorEnum(puzzle.winColor)}선승`}
                  sequence={puzzle.boardStatus}
                  isLocked={!puzzle.isLocked} // TODO: 잠금 - 심각!!!!! 서버에서 locked T/F 바꾸면 바꿔주기
                  bottom={() => (
                    <CustomText size={10} lineHeight="sm" color="gray/gray500">
                      {puzzle.description}
                    </CustomText>
                  )}
                  onPress={() => {
                    navigation.navigate('LessonPuzzleSolve', {
                      id: puzzle.id,
                      boardStatus: puzzle.boardStatus,
                      title: puzzle.title,
                      author: 'Renzzle',
                      description: `깊이 ${puzzle.depth} • 난이도 ${toDifficultyEnum(
                        puzzle.difficulty,
                      )} • ${toWinColorEnum(puzzle.winColor)}선승`,
                      depth: puzzle.depth,
                    });
                  }}
                />
              );
            })}
        </CardsContainer>
      </ScrollView>
    </PuzzleListContainer>
  );
};

export default LessonPuzzleList;
