import EncryptedStorage from 'react-native-encrypted-storage';
import { create } from 'zustand';

// TODO: 추후 api로 광고제거 정보 불러오게 되면 스토어 삭제

const ADS_REMOVED_KEY = 'iap.adsRemoved';

interface PurchaseStore {
  isAdsRemoved: boolean;
  isHydrated: boolean;
  initializePurchaseState: () => Promise<void>;
  setAdsRemoved: (isAdsRemoved: boolean) => Promise<void>;
}

const usePurchaseStore = create<PurchaseStore>((set) => ({
  isAdsRemoved: false,
  isHydrated: false,

  initializePurchaseState: async () => {
    try {
      const storedValue = await EncryptedStorage.getItem(ADS_REMOVED_KEY);
      set({
        isAdsRemoved: storedValue === 'true',
        isHydrated: true,
      });
    } catch (error) {
      console.log('Failed to restore purchase state:', error);
      set({ isHydrated: true });
    }
  },

  setAdsRemoved: async (isAdsRemoved) => {
    try {
      await EncryptedStorage.setItem(ADS_REMOVED_KEY, String(isAdsRemoved));
      set({ isAdsRemoved });
    } catch (error) {
      console.log('Failed to save purchase state:', error);
      throw error;
    }
  },
}));

export default usePurchaseStore;
