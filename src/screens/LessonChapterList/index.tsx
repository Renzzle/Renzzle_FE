import React from 'react';
import { ButtonContainer } from './index.styles';
import MainFeatureButton from '../../components/features/MainFeatureButton';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

const LessonChapterList = () => {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();
  return (
    <ButtonContainer>
      <MainFeatureButton text="Ch. 1" color="sub_color/beige/h" onPress={() => navigation.navigate('LessonPuzzleList')} />
      <MainFeatureButton text="Ch. 2" color="sub_color/beige/p" onPress={() => ''} />
      <MainFeatureButton text="Ch. 3" color="sub_color/beige/s" onPress={() => ''} />
    </ButtonContainer>
  );
};

export default LessonChapterList;
