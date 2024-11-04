import React from 'react';
import { BackButton } from './index.styles';
import { ChevronThinLeftIcon } from '../../common/Icons';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { ParamListBase } from '@react-navigation/native';

interface DrawerMenuButtonProps {
  navigation: DrawerNavigationProp<ParamListBase>;
}

const GoBackButton: React.FC<DrawerMenuButtonProps> = ({ navigation }) => {
  return (
    <BackButton onPress={() => navigation.goBack()}>
      <ChevronThinLeftIcon />
    </BackButton>
  );
};

export default GoBackButton;
