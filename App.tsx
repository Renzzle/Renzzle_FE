/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import theme from './src/styles/theme';
import LessonPuzzleList from './src/screens/puzzleList/LessonPuzzleList';
import CommunityPuzzleList from './src/screens/puzzleList/CommunityPuzzleList';
import DrawerNavigator from './src/screens/DrawerNavigator';
import LessonChapterList from './src/screens/LessonChapterList';
import LessonPuzzleSolve from './src/screens/puzzleSolve/LessonPuzzleSolve';
import CommunityPuzzleSolve from './src/screens/puzzleSolve/CommunityPuzzleSolve';
import CommunityPuzzleMake from './src/screens/puzzleMake/CommunityPuzzleMake';
import AIPuzzleSolve from './src/screens/puzzleSolve/AIPuzzleSolve';
import AIPuzzleMake from './src/screens/puzzleMake/AIPuzzleMake';
import Signin from './src/screens/Signin';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
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
        }}
      >
        <Stack.Screen
          name="Home"
          component={DrawerNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Signin"
          component={Signin}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LessonChapterList"
          component={LessonChapterList}
          options={{ title: 'Lesson' }}
        />
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
