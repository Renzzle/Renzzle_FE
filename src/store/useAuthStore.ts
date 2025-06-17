import { create } from 'zustand';
import { getAuth } from '../apis/auth';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useUserStore } from './useUserStore';
import { getUser } from '../apis/user';

const initialState = {
  accessToken: undefined,
  refreshToken: undefined,
};

type AuthStateType = {
  accessToken?: string;
  refreshToken?: string;
  signin: (email: string, password: string) => Promise<void>;
  restoreCredentials: () => Promise<{ accessToken?: string; refreshToken?: string }>;
  signout: () => Promise<void>;
  setTokens: (accessToken: string, refreshToken: string) => Promise<void>;
  clearTokens: () => Promise<void>;
};

const useAuthStore = create<AuthStateType>((set) => ({
  ...initialState,

  async signin(email: string, password: string) {
    try {
      const { response } = await getAuth(email, password);
      const { accessToken, refreshToken } = response;

      await EncryptedStorage.setItem('tokens', JSON.stringify({ accessToken, refreshToken }));

      console.log('Accesstoken 저장:', accessToken);
      console.log('Refreshtoken 저장:', refreshToken);

      set((state) => ({
        ...state,
        accessToken,
        refreshToken,
      }));

      const user = await getUser(accessToken);
      useUserStore.getState().setUser(user);
    } catch (error) {
      console.log('Fail to sign in:', error);
      throw error;
    }
  },

  async restoreCredentials() {
    try {
      const storedTokens = await EncryptedStorage.getItem('tokens');
      if (!storedTokens) {
        return {};
      }

      const { accessToken, refreshToken } = JSON.parse(storedTokens);

      set((state) => ({
        ...state,
        accessToken,
        refreshToken,
      }));

      return { accessToken, refreshToken };
    } catch (error) {
      console.error('Failed to restore credentials:', error);
      return {};
    }
  },

  async signout() {
    try {
      await EncryptedStorage.removeItem('tokens');
      set(initialState);

      useUserStore.getState().clearUser();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  },

  async setTokens(accessToken: string, refreshToken: string) {
    try {
      await EncryptedStorage.setItem('tokens', JSON.stringify({ accessToken, refreshToken }));
      set((state) => ({ ...state, accessToken, refreshToken }));
    } catch (error) {
      console.error('Failed to set tokens:', error);
    }
  },

  async clearTokens() {
    try {
      await EncryptedStorage.removeItem('tokens');
      set(initialState);

      useUserStore.getState().clearUser();
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  },
}));

export default useAuthStore;
