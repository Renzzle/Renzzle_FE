import { useState, useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import useAuthStore from '../../store/useAuthStore';
import { useUserStore } from '../../store/useUserStore';
import { showBottomToast } from '../../components/common/Toast/toastMessage';
import i18n, { initI18n } from '../../locales/i18n';
import { getAppData } from '../../apis/config';
import useConfigStore from '../../store/useConfigStore';

const useInitializeApp = (): boolean => {
  const [isLoading, setIsLoading] = useState(true);
  const { restoreCredentials, setTokens, clearTokens } = useAuthStore();
  const { setUser } = useUserStore(); // Get setters from the user store
  const { setFeedbackUrl } = useConfigStore();

  useEffect(() => {
    const loadAppData = async () => {
      try {
        const config = await getAppData();
        const feedbackUrl = config.response.find(
          (i: { tag: string }) => i.tag === 'feedback_url',
        )?.value;
        if (feedbackUrl) {
          setFeedbackUrl(feedbackUrl);
        }
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
        SplashScreen.hide();
        setIsLoading(false);
        console.log('App initialization complete');
      }
    };

    initApp();
  }, [restoreCredentials, setTokens, clearTokens, setUser, setFeedbackUrl]);

  return isLoading;
};

export default useInitializeApp;
