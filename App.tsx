/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import './src/locales/i18n.ts';
import theme from './src/styles/theme';
import LessonPuzzleList from './src/screens/puzzleList/LessonPuzzleList';
import CommunityPuzzleList from './src/screens/puzzleList/CommunityPuzzleList';
import LessonPuzzleSolve from './src/screens/puzzleSolve/LessonPuzzleSolve';
import CommunityPuzzleSolve from './src/screens/puzzleSolve/CommunityPuzzleSolve';
import CommunityPuzzleMake from './src/screens/puzzleMake/CommunityPuzzleMake';
import AIPuzzleSolve from './src/screens/puzzleSolve/AIPuzzleSolve';
import AIPuzzleMake from './src/screens/puzzleMake/AIPuzzleMake';
import Signin from './src/screens/Signin';
import Home from './src/screens/Home/index.tsx';
import SplashScreen from 'react-native-splash-screen';
import useAuthStore from './src/store/useAuthStore.ts';
import { getUser } from './src/apis/user.ts';
import { reissueToken } from './src/apis/auth.ts';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  const { accessToken, refreshToken, setTokens, clearTokens } = useAuthStore();
  const [initialScreen, setInitialScreen] = useState<'Signin' | 'Home'>('Signin');

  useEffect(() => {
    const init = async () => {
      try {
        if (accessToken) {
          const user = await getUser(accessToken);
          if (user) {
            setInitialScreen('Home');
            return;
          }
        }

        // No token or user -> reissue
        if (refreshToken) {
          try {
            const { newAccessToken, newRefreshToken } = await reissueToken(refreshToken);
            setTokens(newAccessToken, newRefreshToken);

            const user = await getUser(newAccessToken);
            if (user) {
              setInitialScreen('Home');
              return;
            }
          } catch (err) {
            // Failed to reissue tokens
            clearTokens();
            setInitialScreen('Signin');
          }
        } else {
          setInitialScreen('Signin');
        }
      } catch (error) {
        clearTokens();
        setInitialScreen('Signin');
      } finally {
        SplashScreen.hide();
      }
    };

    init();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Signin"
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.color['gray/grayBG'],
          },
          headerTitleStyle: {
            fontSize: 18,
          },
        }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Signin" component={Signin} options={{ headerShown: false }} />
        <Stack.Screen
          name="LessonPuzzleList"
          component={LessonPuzzleList}
          options={{ title: 'Lesson' }}
        />
        <Stack.Screen
          name="LessonPuzzleSolve"
          component={LessonPuzzleSolve}
          options={{ title: 'Lesson' }}
        />
        <Stack.Screen
          name="CommunityPuzzleList"
          component={CommunityPuzzleList}
          options={{ title: 'Community' }}
        />
        <Stack.Screen
          name="CommunityPuzzleSolve"
          component={CommunityPuzzleSolve}
          options={{ title: 'Community' }}
        />
        <Stack.Screen
          name="CommunityPuzzleMake"
          component={CommunityPuzzleMake}
          options={{ title: 'Community' }}
        />
        <Stack.Screen name="AIPuzzleSolve" component={AIPuzzleSolve} options={{ title: 'AI' }} />
        <Stack.Screen name="AIPuzzleMake" component={AIPuzzleMake} options={{ title: 'AI' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
