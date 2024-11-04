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
import LessonPuzzleList from './src/screens/PuzzleList/LessonPuzzleList';
import CommunityPuzzleList from './src/screens/PuzzleList/CommunityPuzzleList';
import DrawerNavigator from './src/screens/DrawerNavigator';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
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
          name="LessonPuzzleList"
          component={LessonPuzzleList}
        />
        <Stack.Screen
          name="CommunityPuzzleList"
          component={CommunityPuzzleList}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
