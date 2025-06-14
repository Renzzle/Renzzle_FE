/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackHeaderProps } from '@react-navigation/native-stack';
import './src/locales/i18n.ts';
import LessonPuzzleList from './src/screens/puzzleList/LessonPuzzleList';
import CommunityPuzzleList from './src/screens/puzzleList/CommunityPuzzleList';
import LessonPuzzleSolve from './src/screens/puzzleSolve/LessonPuzzleSolve';
import CommunityPuzzleSolve from './src/screens/puzzleSolve/CommunityPuzzleSolve';
import CommunityPuzzleMake from './src/screens/puzzleMake/CommunityPuzzleMake';
import AIPuzzleSolve from './src/screens/puzzleSolve/AIPuzzleSolve';
import AIPuzzleMake from './src/screens/puzzleMake/AIPuzzleMake';
import Signin from './src/screens/Signin';
import Home from './src/screens/Home/index.tsx';
import useAuthStore from './src/store/useAuthStore.ts';
import useInitializeApp from './src/hooks/useInitializeApp/index.ts';
import AppWrapper from './src/components/common/AppWrapper/index.tsx';
import CustomHeader from './src/components/common/CustomHeader/index.tsx';
import Signup from './src/screens/Signup/index.tsx';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/components/common/Toast/toast.config.tsx';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element | null {
  const { accessToken } = useAuthStore();
  const isLoading = useInitializeApp();

  const renderCustomHeader = (props: NativeStackHeaderProps) => <CustomHeader {...props} />;

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      <AppWrapper>
        <Stack.Navigator
          screenOptions={{
            header: renderCustomHeader,
          }}>
          {accessToken ? (
            <>
              <Stack.Screen name="Home" component={Home} options={{ title: 'common.appName' }} />
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
              <Stack.Screen
                name="AIPuzzleSolve"
                component={AIPuzzleSolve}
                options={{ title: 'AI' }}
              />
              <Stack.Screen
                name="AIPuzzleMake"
                component={AIPuzzleMake}
                options={{ title: 'AI' }}
              />
            </>
          ) : (
            <>
              <Stack.Screen name="Signin" component={Signin} options={{ headerShown: false }} />
              <Stack.Screen name="Signup" component={Signup} options={{ title: 'auth.signup' }} />
            </>
          )}
        </Stack.Navigator>
      </AppWrapper>
      <Toast config={toastConfig} />
    </NavigationContainer>
  );
}

export default App;
