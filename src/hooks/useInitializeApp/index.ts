import { useState, useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { getUser } from '../../apis/user';
import { reissueToken } from '../../apis/auth';
import useAuthStore from '../../store/useAuthStore';
import { useUserStore, User } from '../../store/useUserStore';

const validateAccessToken = async (token: string): Promise<User | null> => {
  try {
    const user = await getUser(token);
    console.log('User verified with existing access token');
    return user;
  } catch {
    console.log('Access token validation failed');
    return null;
  }
};

const tryReissueToken = async (
  refreshToken: string,
): Promise<{ accessToken: string; refreshToken: string } | null> => {
  try {
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await reissueToken(
      refreshToken,
    );
    console.log('Token reissue successful');
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (err) {
    console.log('Token reissue failed', err);
    return null;
  }
};

const useInitializeApp = (): boolean => {
  const [isLoading, setIsLoading] = useState(true);
  const { restoreCredentials, setTokens, clearTokens } = useAuthStore();
  const { setUser } = useUserStore(); // Get setters from the user store

  useEffect(() => {
    const initApp = async () => {
      try {
        await restoreCredentials();
        const { accessToken, refreshToken } = useAuthStore.getState();

        const handleSuccessfulLogin = (user: User) => {
          setUser(user);
        };

        const handleLogout = async () => {
          await clearTokens();
        };

        if (accessToken) {
          const user = await validateAccessToken(accessToken);
          if (user) {
            handleSuccessfulLogin(user);
          } else if (refreshToken) {
            const tokens = await tryReissueToken(refreshToken);
            if (tokens) {
              await setTokens(tokens.accessToken, tokens.refreshToken);
              const newUser = await getUser(tokens.accessToken);
              handleSuccessfulLogin(newUser);
            } else {
              await handleLogout();
            }
          } else {
            await handleLogout();
          }
        } else if (refreshToken) {
          const tokens = await tryReissueToken(refreshToken);
          if (tokens) {
            await setTokens(tokens.accessToken, tokens.refreshToken);
            const newUser = await getUser(tokens.accessToken);
            handleSuccessfulLogin(newUser);
          } else {
            await handleLogout();
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
  }, [restoreCredentials, setTokens, clearTokens, setUser]);

  return isLoading;
};

export default useInitializeApp;
