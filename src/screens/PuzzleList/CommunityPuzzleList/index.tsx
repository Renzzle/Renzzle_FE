import React from 'react';
import PuzzleListCard from '../../../components/features/PuzzleListCard';
import { AddButtonContainer, CardsContainer } from './index.styles';
import TagSmall from '../../../components/common/TagSmall';
import { ScrollView, View } from 'react-native';
import CircleButton from '../../../components/features/CircleButton';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

const CommunityPuzzleList = () => {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();

  const handleAddPuzzle = () => {
    navigation.navigate('LessonChapterList');
  };

  return (
    <View>
      <ScrollView>
        <CardsContainer>
          <PuzzleListCard
            title="흑선승 VCF"
            author="isoo"
            description="해결 130 | 정답률 86%"
            bottom={() => (
              <TagSmall>No.1329</TagSmall>
            )}
            isLocked={false}
          />
          <PuzzleListCard
            title="백선승 VCF"
            author="isoo"
            description="해결 13 | 정답률 66%"
            bottom={() => (
              <TagSmall>No.1329</TagSmall>
            )}
            isLocked={false}
          />
          <PuzzleListCard
            title="백선승 VCF"
            author="isoo"
            description="해결 13 | 정답률 66%"
            bottom={() => (
              <TagSmall>No.1329</TagSmall>
            )}
            isLocked={false}
          />
          <PuzzleListCard
            title="백선승 VCF"
            author="isoo"
            description="해결 13 | 정답률 66%"
            bottom={() => (
              <TagSmall>No.1329</TagSmall>
            )}
            isLocked={false}
          />
          <PuzzleListCard
            title="백선승 VCF"
            author="isoo"
            description="해결 13 | 정답률 66%"
            bottom={() => (
              <TagSmall>No.1329</TagSmall>
            )}
            isLocked={false}
          />
        </CardsContainer>
      </ScrollView>
      <AddButtonContainer>
        <CircleButton category="add" onPress={handleAddPuzzle} />
      </AddButtonContainer>
    </View>

  );
};

export default CommunityPuzzleList;
