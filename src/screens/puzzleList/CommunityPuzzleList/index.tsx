import React, { useCallback, useState } from 'react';
import PuzzleListCard from '../../../components/features/PuzzleListCard';
import { AddButtonContainer, CardsContainer, PuzzleListContainer } from './index.styles';
import { ScrollView } from 'react-native';
import CircleButton from '../../../components/features/CircleButton';
import { ParamListBase, useFocusEffect, useNavigation } from '@react-navigation/native';
import { getCommunityPuzzle } from '../../../apis/community';
import { CommunityPuzzleListResponse } from '../../../components/types';
import { toDifficultyEnum, toWinColorEnum } from '../../../utils/utils';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useAuthStore from '../../../store/useAuthStore';

const CommunityPuzzleList = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [puzzleList, setPuzzleList] = useState<CommunityPuzzleListResponse>();
  const { accessToken } = useAuthStore();

  const handleAddPuzzle = () => {
    navigation.navigate('CommunityPuzzleMake');
  };

  useFocusEffect(
    useCallback(() => {
      const loadPuzzleList = async () => {
        if (accessToken === undefined) {
          alert('accesstoken 없음');
          navigation.navigate('Signin');
        } else {
          try {
            const data = await getCommunityPuzzle(accessToken, 100);
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
                  author={puzzle.authorName}
                  description={`해결 ${puzzle.solvedCount} • 정답률 ${puzzle.correctRate}% • 깊이 ${
                    puzzle.depth
                  } • 난이도 ${toDifficultyEnum(puzzle.difficulty)} • ${toWinColorEnum(
                    puzzle.winColor,
                  )}선승`}
                  sequence={puzzle.boardStatus}
                  isLocked={false}
                  bottom={() => <></>}
                  onPress={() => {
                    navigation.navigate('CommunityPuzzleSolve', {
                      id: puzzle.id,
                      boardStatus: puzzle.boardStatus,
                      title: puzzle.title,
                      author: puzzle.authorName,
                      description: `해결 ${puzzle.solvedCount} • 정답률 ${
                        puzzle.correctRate
                      }% • 깊이 ${puzzle.depth} • 난이도 ${toDifficultyEnum(
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
      <AddButtonContainer>
        <CircleButton category="add" onPress={handleAddPuzzle} />
      </AddButtonContainer>
    </PuzzleListContainer>
  );
};

export default CommunityPuzzleList;
