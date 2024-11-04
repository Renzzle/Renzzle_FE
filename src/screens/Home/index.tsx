import { DrawerNavigationProp } from '@react-navigation/drawer';
import React from 'react';
import { Button, Text, View } from 'react-native';
import { ParamListBase, useNavigation } from '@react-navigation/native';

const Home = () => {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();
  return (
    <View>
      <Text>Home</Text>
      <Button title="Go to LessonPuzzleList" onPress={() => navigation.navigate('LessonPuzzleList')} />
    </View>
  );
};

export default Home;
