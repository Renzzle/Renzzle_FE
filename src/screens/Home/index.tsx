import { DrawerNavigationProp } from '@react-navigation/drawer';
import React from 'react';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import MainFeatureButton from '../../components/features/MainFeatureButton';
import { ButtonContainer, HomeContainer } from './index.styles';
import useModal from '../../hooks/useModal';
import CustomModal from '../../components/common/CustomModal';

const Home = () => {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();
  const {
    isModalVisible,
    category: modalCategory,
    activateModal,
    closePrimarily,
    closeSecondarily,
  } = useModal();

  return (
    <HomeContainer>
      <ButtonContainer>
        <MainFeatureButton text="Lesson" color="sub_color/green/c" onPress={() => navigation.navigate('LessonChapterList')} />
        <MainFeatureButton text="Community" color="sub_color/green/s" onPress={() => navigation.navigate('Community')} />
        <MainFeatureButton text="AI Puzzle" color="sub_color/green/p" onPress={() => activateModal('PUZZLE_FAILURE', {primaryAction: () => {}, secondaryAction: () => {}})} />
      </ButtonContainer>

      {isModalVisible && <CustomModal isVisible={isModalVisible} category={modalCategory} onPrimaryAction={closePrimarily} onSecondaryAction={closeSecondarily} />}
    </HomeContainer>

  );
};

export default Home;
