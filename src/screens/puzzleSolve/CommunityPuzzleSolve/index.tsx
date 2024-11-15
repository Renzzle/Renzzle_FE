import React from 'react';
import { Text } from 'react-native';
import { CommunityPuzzleSolveProps } from '../../../components/features/ParamList/index.types';

const CommunityPuzzleSolve = ({ route }: CommunityPuzzleSolveProps) => {
  const { id, boardStatus, title, author, description } = route.params;

  console.log(id + boardStatus + title + author + description);
  // TODO: 레이아웃 개발
  return (
    <Text>CommunityPuzzleSolve</Text>
  );
};

export default CommunityPuzzleSolve;
