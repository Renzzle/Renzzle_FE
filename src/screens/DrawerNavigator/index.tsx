import { createDrawerNavigator, DrawerNavigationOptions } from '@react-navigation/drawer';
import React from 'react';
import LikeList from '../PuzzleList/LikeList';
import theme from '../../styles/theme';
import DrawerMenuButton from '../../components/features/DrawerMenuButton';
import GoBackButton from '../../components/features/GoBackButton';
import Home from '../Home';
import HeaderLogoIcon from '../../components/features/HeaderLogoIcon';

const Drawer = createDrawerNavigator();
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerPosition: 'right',
        drawerStyle: {
          backgroundColor: theme.color['gray/grayBG'],
        },
        drawerContentStyle: {
          backgroundColor: theme.color['gray/grayBG'],
        },
        drawerActiveTintColor: theme.color['main_color/green'],
        drawerInactiveTintColor: theme.color['gray/gray500'],
        drawerActiveBackgroundColor: theme.color['sub_color/green/bg'],
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
          headerLeft: HeaderLogoIcon,
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
