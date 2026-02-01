/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackHeaderProps } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import './src/locales/i18n.ts';
import useAuthStore from './src/store/useAuthStore.ts';
import useInitializeApp from './src/hooks/useInitializeApp/index.ts';
import AppWrapper from './src/components/common/AppWrapper/index.tsx';
import CustomHeader from './src/components/common/CustomHeader/index.tsx';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/components/common/Toast/toast.config.tsx';
import Signup from './src/screens/Signup/index.tsx';
import Signin from './src/screens/Signin';
import Home from './src/screens/Home/index.tsx';
import MyPuzzles from './src/screens/MyPuzzles/index.tsx';
import LikedPuzzles from './src/screens/LikedPuzzles/index.tsx';
import Ranking from './src/screens/Ranking/index.tsx';
import TrainingPacks from './src/screens/TrainingPacks/index.tsx';
import TrainingPuzzles from './src/screens/TrainingPuzzles/index.tsx';
import TrainingPuzzleSolve from './src/screens/TrainingPuzzleSolve/index.tsx';
import CommunityPuzzles from './src/screens/CommunityPuzzles/index.tsx';
import CommunityPuzzleSolve from './src/screens/CommunityPuzzleSolve/index.tsx';
import CreateCommunityPuzzle from './src/screens/CreateCommunityPuzzle/index.tsx';
import RankedPuzzleSolve from './src/screens/RankedPuzzleSolve/index.tsx';
import PuzzleReview from './src/screens/PuzzleReview/index.tsx';
import AnswerCommunityPuzzle from './src/screens/CreateCommunityPuzzle/AnswerCommunityPuzzle/index.tsx';
import theme from './src/styles/theme.ts';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element | null {
  const { accessToken } = useAuthStore();
  const isLoading = useInitializeApp();

  const renderCustomHeader = (props: NativeStackHeaderProps) => <CustomHeader {...props} />;

  if (isLoading) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppWrapper>
            <StatusBar
              barStyle={'dark-content'}
              backgroundColor={theme.color['gray/grayBG']}
              translucent={false}
            />

            <Stack.Navigator
              screenOptions={{
                header: renderCustomHeader,
              }}>
              {accessToken ? (
                <>
                  <Stack.Screen
                    name="Home"
                    component={Home}
                    options={{ title: 'common.appName' }}
                  />
                  <Stack.Screen
                    name="MyPuzzles"
                    component={MyPuzzles}
                    options={{ title: 'common.myPuzzle' }}
                  />
                  <Stack.Screen
                    name="LikedPuzzles"
                    component={LikedPuzzles}
                    options={{ title: 'common.likes' }}
                  />
                  <Stack.Screen
                    name="Ranking"
                    component={Ranking}
                    options={{ title: 'common.ranking' }}
                  />
                  <Stack.Screen
                    name="TrainingPacks"
                    component={TrainingPacks}
                    options={{ title: 'home.trainingPuzzle' }}
                  />
                  <Stack.Screen
                    name="TrainingPuzzles"
                    component={TrainingPuzzles}
                    options={{ title: 'home.trainingPuzzle' }}
                  />
                  <Stack.Screen
                    name="TrainingPuzzleSolve"
                    component={TrainingPuzzleSolve}
                    options={{ title: 'home.trainingPuzzle' }}
                  />
                  <Stack.Screen
                    name="TrainingPuzzleReview"
                    component={PuzzleReview}
                    options={{ title: 'home.trainingPuzzle' }}
                  />
                  <Stack.Screen
                    name="CommunityPuzzles"
                    component={CommunityPuzzles}
                    options={{ title: 'home.communityPuzzle' }}
                  />
                  <Stack.Screen
                    name="CommunityPuzzleSolve"
                    component={CommunityPuzzleSolve}
                    options={{ title: 'home.communityPuzzle' }}
                  />
                  <Stack.Screen
                    name="CommunityPuzzleReview"
                    component={PuzzleReview}
                    options={{ title: 'home.communityPuzzle' }}
                  />
                  <Stack.Screen
                    name="CreateCommunityPuzzle"
                    component={CreateCommunityPuzzle}
                    options={{ title: 'home.communityPuzzle' }}
                  />
                  <Stack.Screen
                    name="AnswerCommunityPuzzle"
                    component={AnswerCommunityPuzzle}
                    options={{ title: 'home.communityPuzzle' }}
                  />
                  <Stack.Screen
                    name="RankedPuzzleSolve"
                    component={RankedPuzzleSolve}
                    options={{ title: 'home.rankingPuzzle' }}
                  />
                </>
              ) : (
                <>
                  <Stack.Screen name="Signin" component={Signin} options={{ headerShown: false }} />
                  <Stack.Screen
                    name="Signup"
                    component={Signup}
                    options={{ title: 'auth.signup' }}
                  />
                </>
              )}
            </Stack.Navigator>
          </AppWrapper>
          <Toast config={toastConfig} />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default App;
