/* eslint-disable react-hooks/exhaustive-deps */
import { createDrawerNavigator, DrawerNavigationOptions } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import theme from '../../styles/theme';
import DrawerMenuButton from '../../components/features/DrawerMenuButton';
import GoBackButton from '../../components/features/GoBackButton';
import Home from '../Home';
import HeaderLogoIcon from '../../components/features/HeaderLogoIcon';
import LikedPuzzleList from '../puzzleList/LikedPuzzleList';
import useAuthStore from '../../store/useAuthStore';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const Drawer = createDrawerNavigator();
const DrawerNavigator = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const { accessToken, restoreCredentials } = useAuthStore();
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      await restoreCredentials();
      setIsRestoring(false);
    };
    initialize();
  }, []);

  useEffect(() => {
    if (!isRestoring) {
      console.log('홈진입! 액세스토큰: ', accessToken);
      if (accessToken === undefined) {
        navigation.navigate('Signin');
      }
    }
  }, [isRestoring, accessToken]);

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
          fontFamily: 'Pretendard-Medium',
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
        name="LikedPuzzleList"
        component={LikedPuzzleList}
        options={
          ({ navigation }): DrawerNavigationOptions => ({
            headerLeft: () => <GoBackButton navigation={navigation} />,
            title: '좋아요',
          })
        }
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
