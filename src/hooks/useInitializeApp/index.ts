import { useState, useEffect } from 'react';
import useAuthStore from '../../store/useAuthStore';
import { useUserStore } from '../../store/useUserStore';
import { showBottomToast } from '../../components/common/Toast/toastMessage';
import i18n, { initI18n } from '../../locales/i18n';
import useConfigStore from '../../store/useConfigStore';
import useTutorialStore from '../../store/useTutorialStore';

const useInitializeApp = (): boolean => {
  const [isLoading, setIsLoading] = useState(true);
  const { restoreCredentials, clearTokens } = useAuthStore();
  const loadAppData = useConfigStore((state) => state.loadAppData);
  const restoreTutorialPending = useTutorialStore((state) => state.restoreTutorialPending);

  useEffect(() => {
    const initApp = async () => {
      try {
        const [, credentials] = await Promise.all([
          initI18n(),
          restoreCredentials(),
          restoreTutorialPending(),
        ]);
        const { accessToken, refreshToken } = credentials;

        if (accessToken || refreshToken) {
          try {
            // 앱 설정은 유저 정보와 상관없으므로 함께 요청한다
            await Promise.all([useUserStore.getState().updateUser(), loadAppData()]);
          } catch (error) {
            console.log('자동 로그인 실패:', error);
            await clearTokens();
          }
        }
      } catch (error) {
        showBottomToast('error', i18n.t('toast.appStartError'));
        await clearTokens();
      } finally {
        setIsLoading(false);
        console.log('App initialization complete');
      }
    };

    initApp();
  }, [restoreCredentials, clearTokens, loadAppData, restoreTutorialPending]);

  return isLoading;
};

export default useInitializeApp;
