import { create } from 'zustand';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useUserStore } from './useUserStore';

const initialState = {
  accessToken: undefined,
  refreshToken: undefined,
};

type AuthStateType = {
  accessToken?: string;
  refreshToken?: string;
  restoreCredentials: () => Promise<{ accessToken?: string; refreshToken?: string }>;
  setTokens: (accessToken: string, refreshToken: string) => Promise<void>;
  clearTokens: () => Promise<void>;
};

const useAuthStore = create<AuthStateType>((set) => ({
  ...initialState,

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
      console.log('Failed to restore credentials:', error);
      await EncryptedStorage.removeItem('tokens');
      set(initialState);
      useUserStore.getState().clearUser();
      return {};
    }
  },

  async setTokens(accessToken: string, refreshToken: string) {
    try {
      await EncryptedStorage.setItem('tokens', JSON.stringify({ accessToken, refreshToken }));
      set((state) => ({ ...state, accessToken, refreshToken }));
    } catch (error) {
      console.log('Failed to set tokens:', error);
    }
  },

  async clearTokens() {
    try {
      await EncryptedStorage.removeItem('tokens');
      set(initialState);

      useUserStore.getState().clearUser();
    } catch (error) {
      console.log('Failed to clear tokens:', error);
    }
  },
}));

export default useAuthStore;
