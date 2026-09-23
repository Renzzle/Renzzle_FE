/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { BackHandler, Linking, Platform, StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackHeaderProps } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import i18n from './src/locales/i18n.ts';
import useAuthStore from './src/store/useAuthStore.ts';
import useInitializeApp from './src/hooks/useInitializeApp/index.ts';
import AppWrapper from './src/components/common/AppWrapper/index.tsx';
import CustomHeader from './src/components/common/CustomHeader/index.tsx';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/components/common/Toast/toast.config.tsx';
import Signup from './src/screens/Signup/index.tsx';
import Signin from './src/screens/Signin';
import FindPassword from './src/screens/FindPassword/index.tsx';
import Home from './src/screens/Home/index.tsx';
import MyPuzzles from './src/screens/MyPuzzles/index.tsx';
import LikedPuzzles from './src/screens/LikedPuzzles/index.tsx';
import Ranking from './src/screens/Ranking/index.tsx';
import Settings from './src/screens/Settings/index.tsx';
import TrainingPacks from './src/screens/TrainingPacks/index.tsx';
import TrainingPuzzles from './src/screens/TrainingPuzzles/index.tsx';
import TrainingPuzzleSolve from './src/screens/TrainingPuzzleSolve/index.tsx';
import CommunityPuzzles from './src/screens/CommunityPuzzles/index.tsx';
import CommunityPuzzleSolve from './src/screens/CommunityPuzzleSolve/index.tsx';
import CreateCommunityPuzzle from './src/screens/CreateCommunityPuzzle/index.tsx';
import RankedPuzzleSolve from './src/screens/RankedPuzzleSolve/index.tsx';
import RankedGameResult from './src/screens/RankedGameResult/index.tsx';
import RankedPuzzleReview from './src/screens/RankedPuzzleReview/index.tsx';
import PuzzleReview from './src/screens/PuzzleReview/index.tsx';
import AnswerCommunityPuzzle from './src/screens/CreateCommunityPuzzle/AnswerCommunityPuzzle/index.tsx';
import theme from './src/styles/theme.ts';
import useNetworkStore from './src/store/useNetworkStore.ts';
import { CustomModal } from './src/components/common/index.ts';
import Language from './src/screens/Settings/Language/index.tsx';
import ChangeNickname from './src/screens/Settings/ChangeNickname/index.tsx';
import ChangePassword from './src/screens/Settings/ChangePassword/index.tsx';
import Notice from './src/screens/Notice/index.tsx';
import DeviceInfo from 'react-native-device-info';
import { getPersonalNotice } from './src/apis/notice.ts';
import { NoticeLanguage, PersonalNoticeItem } from './src/types/index.ts';

const Stack = createNativeStackNavigator();
const IOS_APP_STORE_ID = '6793042991';
const IOS_APP_STORE_URL = `itms-apps://apps.apple.com/app/id${IOS_APP_STORE_ID}`;

type PersonalNoticeModalState =
  | {
      category: 'PERSONAL_NOTICE';
      notice: PersonalNoticeItem;
      remainingNotices: PersonalNoticeItem[];
    }
  | {
      category: 'FORCE_UPDATE';
      version?: string;
    }
  | {
      category: 'SYSTEM_CHECK';
    }
  | null;

const normalizeNoticeLanguage = (language: string): NoticeLanguage => {
  const languageCode = language.toLowerCase().split('-')[0];

  if (languageCode === 'ko') {
    return 'KO';
  }

  if (languageCode === 'ja' || languageCode === 'jp') {
    return 'JP';
  }

  return 'EN';
};

function App(): React.JSX.Element | null {
  const { accessToken } = useAuthStore();
  const isLoading = useInitializeApp();
  const { isNetworkError, setNetworkError } = useNetworkStore();
  const [personalNoticeModal, setPersonalNoticeModal] =
    React.useState<PersonalNoticeModalState>(null);
  const hasRequestedPersonalNotice = React.useRef(false);

  const renderCustomHeader = (props: NativeStackHeaderProps) => <CustomHeader {...props} />;

  React.useEffect(() => {
    console.log('personal notice gate', {
      isLoading,
      hasAccessToken: !!accessToken,
      hasRequested: hasRequestedPersonalNotice.current,
      version: DeviceInfo.getVersion(),
      platform: Platform.OS,
    });
    if (isLoading || !accessToken || hasRequestedPersonalNotice.current) {
      return;
    }

    let isMounted = true;
    hasRequestedPersonalNotice.current = true;

    const fetchPersonalNotice = async () => {
      try {
        const response = await getPersonalNotice({
          lang: normalizeNoticeLanguage(i18n.language),
          platform: Platform.OS === 'ios' ? 'ios' : 'android',
          version: DeviceInfo.getVersion(),
        });
        const description = response.description ?? response.descrpition;

        if (!isMounted) {
          return;
        }

        if (description === 'context' && response.notice?.length) {
          const [notice, ...remainingNotices] = response.notice;

          setPersonalNoticeModal({
            category: 'PERSONAL_NOTICE',
            notice,
            remainingNotices,
          });
          return;
        }

        if (description === 'update') {
          setPersonalNoticeModal({
            category: 'FORCE_UPDATE',
            version: response.version,
          });
          return;
        }

        if (description === 'system-check') {
          setPersonalNoticeModal({ category: 'SYSTEM_CHECK' });
        }
      } catch (error) {
        console.log('개인 알림 로드 실패:', error);
      }
    };

    fetchPersonalNotice();

    return () => {
      isMounted = false;
    };
  }, [accessToken, isLoading]);

  const handleCloseNetworkError = () => {
    setNetworkError(false);
  };

  const handleClosePersonalNotice = () => {
    if (personalNoticeModal?.category === 'FORCE_UPDATE') {
      if (Platform.OS === 'ios') {
        Linking.openURL(IOS_APP_STORE_URL).catch((error) => {
          console.log('App Store 열기 실패:', error);
        });
        return;
      }

      BackHandler.exitApp();
      return;
    }

    if (personalNoticeModal?.category === 'SYSTEM_CHECK') {
      if (Platform.OS === 'ios') {
        return;
      }

      BackHandler.exitApp();
      return;
    }

    if (personalNoticeModal?.category === 'PERSONAL_NOTICE') {
      const [nextNotice, ...remainingNotices] = personalNoticeModal.remainingNotices;

      if (nextNotice) {
        setPersonalNoticeModal({
          category: 'PERSONAL_NOTICE',
          notice: nextNotice,
          remainingNotices,
        });
        return;
      }
    }

    setPersonalNoticeModal(null);
  };

  const personalNoticeBodyText =
    personalNoticeModal?.category === 'PERSONAL_NOTICE'
      ? personalNoticeModal.notice.context
      : personalNoticeModal?.category === 'FORCE_UPDATE' && personalNoticeModal.version
      ? i18n.t('modal.forceUpdate.message') +
        `\n${i18n.t('modal.forceUpdate.latestVersion')}: ${personalNoticeModal.version}`
      : undefined;
  const personalNoticePrimaryButtonText =
    Platform.OS === 'ios' && personalNoticeModal?.category === 'FORCE_UPDATE'
      ? 'modal.forceUpdate.update'
      : undefined;
  const shouldHidePersonalNoticeFooter =
    Platform.OS === 'ios' && personalNoticeModal?.category === 'SYSTEM_CHECK';

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
                    name="Notice"
                    component={Notice}
                    options={{ title: 'common.notice' }}
                  />
                  <Stack.Screen
                    name="Settings"
                    component={Settings}
                    options={{ title: 'common.settings' }}
                  />
                  <Stack.Screen
                    name="Language"
                    component={Language}
                    options={{ title: 'settings.language' }}
                  />
                  <Stack.Screen
                    name="ChangeNickname"
                    component={ChangeNickname}
                    options={{ title: 'settings.changeNickname' }}
                  />
                  <Stack.Screen
                    name="ChangePassword"
                    component={ChangePassword}
                    options={{ title: 'settings.changePassword' }}
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
                    options={{ title: 'puzzle.review' }}
                  />
                  <Stack.Screen
                    name="TrainingPuzzleViewAnswer"
                    component={PuzzleReview}
                    options={{ title: 'puzzle.viewAnswer' }}
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
                    options={{ title: 'puzzle.review' }}
                  />
                  <Stack.Screen
                    name="CommunityPuzzleViewAnswer"
                    component={PuzzleReview}
                    options={{ title: 'puzzle.viewAnswer' }}
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
                  <Stack.Screen
                    name="RankedGameResult"
                    component={RankedGameResult}
                    options={{ title: 'home.rankingPuzzle' }}
                  />
                  <Stack.Screen
                    name="RankedPuzzleReview"
                    component={RankedPuzzleReview}
                    options={{ title: 'puzzle.review' }}
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
                  <Stack.Screen
                    name="FindPassword"
                    component={FindPassword}
                    options={{ title: 'auth.findPassword' }}
                  />
                </>
              )}
            </Stack.Navigator>

            <CustomModal
              isVisible={isNetworkError}
              category="NETWORK_ERROR"
              onPrimaryAction={handleCloseNetworkError}
            />
            <CustomModal
              isVisible={!!personalNoticeModal}
              category={personalNoticeModal?.category ?? null}
              onPrimaryAction={handleClosePersonalNotice}
              bodyText={personalNoticeBodyText}
              primaryButtonText={personalNoticePrimaryButtonText}
              hideFooter={shouldHidePersonalNoticeFooter}
            />
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
