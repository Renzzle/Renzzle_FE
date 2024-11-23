import React from 'react';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import MainFeatureButton from '../../components/features/MainFeatureButton';
import { ButtonContainer, HomeContainer } from './index.styles';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const Home = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  return (
    <HomeContainer>
      <ButtonContainer>
        <MainFeatureButton text="Lesson" color="sub_color/green/c" onPress={() => navigation.navigate('LessonChapterList')} />
        <MainFeatureButton text="Community" color="sub_color/green/s" onPress={() => navigation.navigate('CommunityPuzzleList')} />
        <MainFeatureButton text="AI Puzzle" color="sub_color/green/p" onPress={() => navigation.navigate('AIPuzzleSolve')} />
      </ButtonContainer>
    </HomeContainer>
  );
};

export default Home;
