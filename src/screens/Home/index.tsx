import { DrawerNavigationProp } from '@react-navigation/drawer';
import React from 'react';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import MainFeatureButton from '../../components/features/MainFeatureButton';
import { ButtonContainer } from './index.styles';

const Home = () => {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();
  return (
    <ButtonContainer>
      <MainFeatureButton text="Lesson" color="sub_color/green/c" onPress={() => navigation.navigate('LessonChapterList')} />
      <MainFeatureButton text="Community" color="sub_color/green/s" onPress={() => navigation.navigate('Community')} />
      <MainFeatureButton text="AI Puzzle" color="sub_color/green/p" onPress={() => navigation.navigate('Lesson')} />
    </ButtonContainer>
  );
};

export default Home;
