import { create } from 'zustand';
import EncryptedStorage from 'react-native-encrypted-storage';

// 회원가입 직후 한 번만 튜토리얼을 보여주기 위한 플래그.
// 튜토리얼을 끝내거나 건너뛰기 전에 앱이 종료되어도 다시 보여줄 수 있도록 저장소에 유지한다.
const TUTORIAL_PENDING_STORAGE_KEY = 'tutorialPending';

interface TutorialStoreState {
  isTutorialPending: boolean;
  restoreTutorialPending: () => Promise<void>;
  setTutorialPending: (isPending: boolean) => Promise<void>;
}

const useTutorialStore = create<TutorialStoreState>((set) => ({
  isTutorialPending: false,

  async restoreTutorialPending() {
    try {
      const stored = await EncryptedStorage.getItem(TUTORIAL_PENDING_STORAGE_KEY);
      set({ isTutorialPending: stored === 'true' });
    } catch (error) {
      console.log('Failed to restore tutorial state:', error);
    }
  },

  async setTutorialPending(isPending: boolean) {
    set({ isTutorialPending: isPending });

    try {
      if (isPending) {
        await EncryptedStorage.setItem(TUTORIAL_PENDING_STORAGE_KEY, 'true');
      } else {
        await EncryptedStorage.removeItem(TUTORIAL_PENDING_STORAGE_KEY);
      }
    } catch (error) {
      console.log('Failed to save tutorial state:', error);
    }
  },
}));

export default useTutorialStore;
