import React from 'react';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { HomeContainer } from './index.styles';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const Home = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  return <HomeContainer />;
};

export default Home;
