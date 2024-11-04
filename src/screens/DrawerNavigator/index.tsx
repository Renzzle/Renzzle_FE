import { createDrawerNavigator, DrawerNavigationOptions } from '@react-navigation/drawer';
import React from 'react';
import CustomHeaderLeft from '../../components/features/CustomHeaderLeft';
import LikeList from '../PuzzleList/LikeList';
import theme from '../../styles/theme';
import DrawerMenuButton from '../../components/features/DrawerMenuButton';
import GoBackButton from '../../components/features/GoBackButton';
import Home from '../Home';

const Drawer = createDrawerNavigator();
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerPosition: 'right',
        drawerStyle: {
          backgroundColor: theme.color['gray/grayBG'], // 드로어 배경색
        },
        drawerContentStyle: {
          backgroundColor: theme.color['gray/grayBG'], // 드로어 내용 배경색
        },
        drawerActiveTintColor: theme.color['main_color/green'], // 활성화된 항목의 텍스트 색상
        drawerInactiveTintColor: theme.color['gray/gray500'], // 비활성화된 항목의 텍스트 색상
        drawerActiveBackgroundColor: theme.color['sub_color/green/bg'], // 활성화된 항목의 배경색
        headerStyle: {
          backgroundColor: theme.color['gray/grayBG'],
        },
        headerTitleStyle: {
          fontSize: 18,
        },
      }}
    >
      <Drawer.Screen
        name="Renzzle"
        component={Home}
        options={({ navigation }) => ({
          headerLeft: CustomHeaderLeft,
          headerRight: () => <DrawerMenuButton navigation={navigation} />,
          headerTitleStyle: {
            fontFamily: 'ChangaOne-Regular',
            fontSize: 24,
          },
          headerTintColor: theme.color['main_color/green'],
        })}
      />
      <Drawer.Screen
        name="LikeList"
        component={LikeList}
        options={({ navigation }): DrawerNavigationOptions => ({
          headerLeft: () => <GoBackButton navigation={navigation} />,
        })}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
