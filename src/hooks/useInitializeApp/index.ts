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

const useInitializeApp = (): boolean => {
  const [isLoading, setIsLoading] = useState(true);
  const { restoreCredentials, setTokens, clearTokens } = useAuthStore();
  const { setUser } = useUserStore(); // Get setters from the user store
  const { setFeedbackUrl, setStoreUrls } = useConfigStore();

  useEffect(() => {
    const loadAppData = async () => {
      try {
        const appData = await getAppData();
        const feedbackUrl = findAppDataValue(appData, 'feedback_url');
        const iosStoreUrl = findAppDataValue(appData, 'ios_store_url');
        const androidStoreUrl = findAppDataValue(appData, 'android_store_url');

        if (feedbackUrl) {
          setFeedbackUrl(feedbackUrl);
        }

        setStoreUrls({ iosStoreUrl, androidStoreUrl });
      } catch (e) {
        console.log('설정 로드 실패:', e);
      }
    };

    const initApp = async () => {
      try {
        await Promise.all([initI18n(), loadAppData()]);
        const credentials = await restoreCredentials();
        const { accessToken, refreshToken } = credentials;

        if (accessToken || refreshToken) {
          try {
            await useUserStore.getState().updateUser();
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
  }, [restoreCredentials, setTokens, clearTokens, setUser, setFeedbackUrl, setStoreUrls]);

  return isLoading;
};

export default useInitializeApp;
