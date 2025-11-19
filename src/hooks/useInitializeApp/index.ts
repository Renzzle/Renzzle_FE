import { useState, useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import useAuthStore from '../../store/useAuthStore';
import { useUserStore } from '../../store/useUserStore';
import { showBottomToast } from '../../components/common/Toast/toastMessage';

const useInitializeApp = (): boolean => {
  const [isLoading, setIsLoading] = useState(true);
  const { restoreCredentials, setTokens, clearTokens } = useAuthStore();
  const { setUser } = useUserStore(); // Get setters from the user store

  useEffect(() => {
    const initApp = async () => {
      try {
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
        showBottomToast('error', '어플리케이션 시작 오류 발생'); // TODO: locales
        await clearTokens();
      } finally {
        SplashScreen.hide();
        setIsLoading(false);
        console.log('App initialization complete');
      }
    };

    initApp();
  }, [restoreCredentials, setTokens, clearTokens, setUser]);

  return isLoading;
};

export default useInitializeApp;
