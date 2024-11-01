/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/screens/Home';
import theme from './src/styles/theme';
import CustomHeaderLeft from './src/components/features/CustomHeaderLeft';

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
          headerTintColor: theme.color['main_color/green'],
          headerTitleStyle: {
            fontFamily: 'ChangaOne-Regular',
            fontSize: 24,
          },
        }}
      >
        <Stack.Screen
          name="Renzzle"
          component={Home}
          options={{
            headerLeft: CustomHeaderLeft,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
