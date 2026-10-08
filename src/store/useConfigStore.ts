import { create } from 'zustand';

interface ConfigStoreState {
  feedbackUrl: string | null;
  iosStoreUrl: string | null;
  androidStoreUrl: string | null;
  setFeedbackUrl: (url: string) => void;
  setStoreUrls: (urls: { iosStoreUrl?: string; androidStoreUrl?: string }) => void;
}

const useConfigStore = create<ConfigStoreState>((set) => ({
  feedbackUrl: null,
  iosStoreUrl: null,
  androidStoreUrl: null,
  setFeedbackUrl: (url) => set({ feedbackUrl: url }),
  setStoreUrls: ({ iosStoreUrl, androidStoreUrl }) =>
    set((state) => ({
      iosStoreUrl: iosStoreUrl ?? state.iosStoreUrl,
      androidStoreUrl: androidStoreUrl ?? state.androidStoreUrl,
    })),
}));

export default useConfigStore;
