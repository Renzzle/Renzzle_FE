import React, { useEffect, useState } from 'react';
import PuzzleListCard from '../../../components/features/PuzzleListCard';
import { AddButtonContainer, CardsContainer, PuzzleListContainer } from './index.styles';
import TagSmall from '../../../components/common/TagSmall';
import { ScrollView } from 'react-native';
import CircleButton from '../../../components/features/CircleButton';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { getPuzzle } from '../../../apis/community';
import { CommunityPuzzleListResponse } from '../../../components/features/Puzzle/index.types';
import { toDifficultyEnum, toWinColorEnum } from '../../../utils/utils';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const CommunityPuzzleList = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [puzzleList, setPuzzleList] = useState<CommunityPuzzleListResponse>();

  const handleAddPuzzle = () => {
    navigation.navigate('CommunityPuzzleMake');
  };

  useEffect(() => {
    const loadPuzzleList = async () => {
      // console.log(`token: ${process.env.ACCESS_TOKEN}`);
      const data = await getPuzzle(`${process.env.ACCESS_TOKEN}`, 100);
      setPuzzleList(data);
    };
    loadPuzzleList();
  });

  return (
    <PuzzleListContainer>
      <ScrollView>
        <CardsContainer>
          {puzzleList?.isSuccess && (
            puzzleList.response.map((puzzle) => {
              return (
                <PuzzleListCard
                  key={puzzle.id}
                  title={puzzle.title}
                  author={puzzle.authorName}
                  description={`해결 ${puzzle.solvedCount} • 정답률 ${puzzle.correctRate}% • 깊이 ${puzzle.depth} • 난이도 ${toDifficultyEnum(puzzle.difficulty)} • ${toWinColorEnum(puzzle.winColor)}선승`}
                  isLocked={false}
                  bottom={() => (
                    <TagSmall>No.{`${puzzle.id}`}</TagSmall>
                  )}
                  onPress={() => {
                    navigation.navigate('CommunityPuzzleSolve', {
                      id: puzzle.id,
                      boardStatus: puzzle.boardStatus,
                      title: puzzle.title,
                      author: puzzle.authorName,
                      description: `해결 ${puzzle.solvedCount} • 정답률 ${puzzle.correctRate}% • 깊이 ${puzzle.depth} • 난이도 ${toDifficultyEnum(puzzle.difficulty)} • ${toWinColorEnum(puzzle.winColor)}선승`,
                    });
                  }}
                />
              );
            })
          )}
        </CardsContainer>
      </ScrollView>
      <AddButtonContainer>
        <CircleButton category="add" onPress={handleAddPuzzle} />
      </AddButtonContainer>
    </PuzzleListContainer>

  );
};

export default CommunityPuzzleList;
