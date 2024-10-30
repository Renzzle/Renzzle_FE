/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import CustomText from './src/components/common/CustomText';
import { BellIcon, CheckIcon, ChevronRightIcon, ChevronThinLeftIcon, CloseIcon, DeleteAccountIcon, ErrorIcon, FilterIcon, HeartIcon, HeartOutlineIcon, LevelIcon, LockIcon, LogoutIcon, MenuIcon, PlusIcon, RadioBlankIcon, RadioMarkedIcon, RankingIcon, SearchIcon, SubscribeIcon } from './src/components/common/Icons';
import theme from './src/styles/theme';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Image source={require('./src/assets/images/logo.png')} style={{ width: 100, height: 100 }} />
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <CustomText color="gray/gray500" size={12} weight="bold">
        안녕 여러분
      </CustomText>
      <CustomText color="gray/gray800" size={16} weight="normal" lineHeight="sm">
        안녕 여러분
      </CustomText>
      <CustomText color="gray/gray900" size={20} weight="bold" lineHeight="lg">
        안녕 여러분
      </CustomText>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
            <Icon name="puzzle-plus" size={24} color="#2200ff" />
            <HeartOutlineIcon />
            <HeartIcon />
            <SubscribeIcon />
            <LevelIcon />
            <RankingIcon />
            <DeleteAccountIcon />
            <LogoutIcon />
            <SearchIcon />
            <FilterIcon />
            <BellIcon />
            <RadioBlankIcon />
            <RadioMarkedIcon />
            <LockIcon />
            <PlusIcon />
            <MenuIcon />
            <ErrorIcon />
            <CloseIcon />
            <CheckIcon />
            <ChevronThinLeftIcon />
            <ChevronRightIcon />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    backgroundColor: theme.color['gray/gray200'],
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
