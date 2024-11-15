import React from 'react';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import MainFeatureButton from '../../components/features/MainFeatureButton';
import { ButtonContainer, HomeContainer } from './index.styles';
import useModal from '../../hooks/useModal';
import CustomModal from '../../components/common/CustomModal';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const Home = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const {
    isModalVisible,
    category: modalCategory,
    closePrimarily,
    closeSecondarily,
  } = useModal();

  return (
    <HomeContainer>
      <ButtonContainer>
        <MainFeatureButton text="Lesson" color="sub_color/green/c" onPress={() => navigation.navigate('LessonChapterList')} />
        <MainFeatureButton text="Community" color="sub_color/green/s" onPress={() => navigation.navigate('CommunityPuzzleList')} />
        <MainFeatureButton text="AI Puzzle" color="sub_color/green/p" onPress={() => navigation.navigate('AIPuzzleSolve')} />
      </ButtonContainer>

      {isModalVisible && <CustomModal isVisible={isModalVisible} category={modalCategory} onPrimaryAction={closePrimarily} onSecondaryAction={closeSecondarily} />}
    </HomeContainer>

  );
};

export default Home;
