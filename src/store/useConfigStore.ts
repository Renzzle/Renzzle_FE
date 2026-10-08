import { create } from 'zustand';

interface ConfigStoreState {
  feedbackUrl: string | null;
  iosStoreUrl: string | null;
  androidStoreUrl: string | null;
  privacyPolicyUrl: string | null;
  termsOfUseUrl: string | null;
  setFeedbackUrl: (url: string) => void;
  setStoreUrls: (urls: { iosStoreUrl?: string; androidStoreUrl?: string }) => void;
  setPolicyUrls: (urls: { privacyPolicyUrl?: string; termsOfUseUrl?: string }) => void;
}

const useConfigStore = create<ConfigStoreState>((set) => ({
  feedbackUrl: null,
  iosStoreUrl: null,
  androidStoreUrl: null,
  privacyPolicyUrl: null,
  termsOfUseUrl: null,
  setFeedbackUrl: (url) => set({ feedbackUrl: url }),
  setStoreUrls: ({ iosStoreUrl, androidStoreUrl }) =>
    set((state) => ({
      iosStoreUrl: iosStoreUrl ?? state.iosStoreUrl,
      androidStoreUrl: androidStoreUrl ?? state.androidStoreUrl,
    })),
  setPolicyUrls: ({ privacyPolicyUrl, termsOfUseUrl }) =>
    set((state) => ({
      privacyPolicyUrl: privacyPolicyUrl ?? state.privacyPolicyUrl,
      termsOfUseUrl: termsOfUseUrl ?? state.termsOfUseUrl,
    })),
}));

export default useConfigStore;
