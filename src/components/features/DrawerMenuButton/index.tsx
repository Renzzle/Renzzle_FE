import React from 'react';
import { MenuButton } from './index.styles';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { ParamListBase } from '@react-navigation/native';

interface DrawerMenuButtonProps {
  navigation: DrawerNavigationProp<ParamListBase>;
}

const DrawerMenuButton: React.FC<DrawerMenuButtonProps> = ({ navigation }) => {
  return <MenuButton onPress={() => navigation.toggleDrawer()} />;
};

export default DrawerMenuButton;
