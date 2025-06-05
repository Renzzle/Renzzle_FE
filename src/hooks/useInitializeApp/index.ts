import { useState, useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { getUser } from '../../apis/user';
import { reissueToken } from '../../apis/auth';
import useAuthStore from '../../store/useAuthStore';

const validateAccessToken = async (token: string): Promise<boolean> => {
  try {
    await getUser(token);
    console.log('User verified with existing access token');
    return true;
  } catch {
    console.log('Access token validation failed');
    return false;
  }
};

const tryReissueToken = async (
  refreshToken: string,
): Promise<{ accessToken: string; refreshToken: string } | null> => {
  try {
    const { newAccessToken, newRefreshToken } = await reissueToken(refreshToken);
    console.log('Access token validation failed');
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (err) {
    console.log('Access token validation failed', err);
    return null;
  }
};

const useInitializeApp = (): boolean => {
  const [isLoading, setIsLoading] = useState(true);
  const { restoreCredentials, setTokens, clearTokens } = useAuthStore();

  useEffect(() => {
    const initApp = async () => {
      try {
        await restoreCredentials();

        let { accessToken, refreshToken } = useAuthStore.getState();

        if (accessToken) {
          const isValid = await validateAccessToken(accessToken);
          if (!isValid && refreshToken) {
            const tokens = await tryReissueToken(refreshToken);
            if (tokens) {
              await setTokens(tokens.accessToken, tokens.refreshToken);
              await getUser(tokens.accessToken);
            } else {
              await clearTokens();
            }
          } else if (!isValid) {
            await clearTokens();
          }
        } else if (refreshToken) {
          const tokens = await tryReissueToken(refreshToken);
          if (tokens) {
            await setTokens(tokens.accessToken, tokens.refreshToken);
            await getUser(tokens.accessToken);
          } else {
            await clearTokens();
          }
        }
      } catch (err) {
        console.error('Error occurred during app initialization: ', err);
        await clearTokens();
      } finally {
        SplashScreen.hide();
        setIsLoading(false);
        console.log('App initialization complete');
      }
    };

    initApp();
  }, [restoreCredentials, setTokens, clearTokens]);

  return isLoading;
};

export default useInitializeApp;
