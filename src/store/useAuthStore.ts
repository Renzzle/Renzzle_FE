import { create } from 'zustand';
import { getAuth } from '../apis/auth';
import EncryptedStorage from 'react-native-encrypted-storage';

const initialState = {
  accessToken: undefined,
  refreshToken: undefined,
};

type AuthStateType = {
  accessToken?: string;
  refreshToken?: string;
  signin: (email: string, password: string) => Promise<void>;
  restoreCredentials: () => Promise<void>;
  signout: () => Promise<void>;
};

const useAuthStore = create<AuthStateType>((set) => ({
  ...initialState,

  async signin(email: string, password: string) {
    try {
      const { response } = await getAuth(email, password);
      const { accessToken, refreshToken } = response;

      await EncryptedStorage.setItem(
        'tokens',
        JSON.stringify({ accessToken, refreshToken })
      );

      console.log('Accesstoken 저장:', accessToken);

      set((state) => ({
        ...state,
        accessToken,
        refreshToken,
      }));
    } catch (error) {
      console.error('Fail to sign in:', error);
      throw error;
    }
  },

  async restoreCredentials() {
    try {
      const storedTokens = await EncryptedStorage.getItem('tokens');
      if (!storedTokens) {return;}

      const { accessToken, refreshToken } = JSON.parse(storedTokens);

      set((state) => ({
        ...state,
        accessToken,
        refreshToken,
      }));
    } catch (error) {
      console.error('Failed to restore credentials:', error);
    }
  },

  async signout() {
    try {
      await EncryptedStorage.removeItem('tokens');
      set(initialState);
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  },
}));

export default useAuthStore;
