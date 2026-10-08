import { useState, useEffect } from 'react';
import BootSplash from 'react-native-bootsplash';
import useAuthStore from '../../store/useAuthStore';
import { useUserStore } from '../../store/useUserStore';
import { showBottomToast } from '../../components/common/Toast/toastMessage';
import i18n, { initI18n } from '../../locales/i18n';
import { AppDataItem, getAppData } from '../../apis/config';
import useConfigStore from '../../store/useConfigStore';

const findAppDataValue = (appData: AppDataItem[], tag: string) =>
  appData.find((item) => item.tag === tag)?.value;

const findAppDataNumber = (appData: AppDataItem[], tag: string) => {
  const value = Number(findAppDataValue(appData, tag));
  return Number.isFinite(value) ? value : undefined;
};

const useInitializeApp = (): boolean => {
  const [isLoading, setIsLoading] = useState(true);
  const { restoreCredentials, clearTokens } = useAuthStore();
  const { setFeedbackUrl, setStoreUrls, setPolicyUrls, setRewardConfig, setPriceConfig } =
    useConfigStore();

  useEffect(() => {
    const loadAppData = async () => {
      try {
        const appData = await getAppData();
        const feedbackUrl = findAppDataValue(appData, 'feedback_url');
        const iosStoreUrl = findAppDataValue(appData, 'ios_store_url');
        const androidStoreUrl = findAppDataValue(appData, 'android_store_url');
        const privacyPolicyUrl = findAppDataValue(appData, 'privacy_policy_url');
        const termsOfUseUrl = findAppDataValue(appData, 'terms_of_use_url');
        const attendanceReward = findAppDataNumber(appData, 'attendance_reward');
        const changeNicknamePrice = findAppDataNumber(appData, 'change_nickname_price');
        const communityReward = findAppDataNumber(appData, 'community_reward');
        const hintPrice = findAppDataNumber(appData, 'hint_price');
        const rankReward = findAppDataNumber(appData, 'rank_reward');
        const trainingReward = findAppDataNumber(appData, 'training_reward');
        if (feedbackUrl) {
          setFeedbackUrl(feedbackUrl);
        }
        setStoreUrls({ iosStoreUrl, androidStoreUrl });
        setPolicyUrls({ privacyPolicyUrl, termsOfUseUrl });
        setRewardConfig({ attendanceReward, communityReward, rankReward, trainingReward });
        setPriceConfig({ changeNicknamePrice, hintPrice });
      } catch (e) {
        console.log('설정 로드 실패:', e);
      }
    };

    const initApp = async () => {
      try {
        const [, credentials] = await Promise.all([initI18n(), restoreCredentials()]);
        const { accessToken, refreshToken } = credentials;

        if (accessToken || refreshToken) {
          try {
            await useUserStore.getState().updateUser();

            if (useUserStore.getState().user) {
              await loadAppData();
            }
          } catch (error) {
            console.log('자동 로그인 실패:', error);
            await clearTokens();
          }
        }
      } catch (error) {
        showBottomToast('error', i18n.t('toast.appStartError'));
        await clearTokens();
      } finally {
        await BootSplash.hide({ fade: true });
        setIsLoading(false);
        console.log('App initialization complete');
      }
    };

    initApp();
  }, [
    restoreCredentials,
    clearTokens,
    setFeedbackUrl,
    setStoreUrls,
    setPolicyUrls,
    setRewardConfig,
    setPriceConfig,
  ]);

  return isLoading;
};

export default useInitializeApp;
