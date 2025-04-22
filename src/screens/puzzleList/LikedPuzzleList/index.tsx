import { ParamListBase, useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ScrollView } from 'react-native';
import { CommunityPuzzleListResponse } from '../../../components/features/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useAuthStore from '../../../store/useAuthStore';
import { getLikePuzzle } from '../../../apis/user';
import { CardsContainer, PuzzleListContainer } from './index.styles';
import PuzzleListCard from '../../../components/features/PuzzleListCard';
import { toDifficultyEnum, toWinColorEnum } from '../../../utils/utils';

const LikedPuzzleList = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [puzzleList, setPuzzleList] = useState<CommunityPuzzleListResponse>();
  const { accessToken } = useAuthStore();

  useFocusEffect(
    useCallback(() => {
      const loadPuzzleList = async () => {
        if (accessToken === undefined) {
          alert('accesstoken 없음');
          navigation.navigate('Signin');
        } else {
          try {
            const data = await getLikePuzzle(accessToken, 100);
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
    </PuzzleListContainer>
  );
};

export default LikedPuzzleList;
