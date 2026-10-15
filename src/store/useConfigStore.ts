import { create } from 'zustand';

interface ConfigStoreState {
  feedbackUrl: string | null;
  iosStoreUrl: string | null;
  androidStoreUrl: string | null;
  privacyPolicyUrl: string | null;
  termsOfUseUrl: string | null;
  attendanceReward: number | null;
  changeNicknamePrice: number | null;
  communityReward: number | null;
  hintPrice: number | null;
  rankReward: number | null;
  trainingReward: number | null;
  setFeedbackUrl: (url: string) => void;
  setStoreUrls: (urls: { iosStoreUrl?: string; androidStoreUrl?: string }) => void;
  setPolicyUrls: (urls: { privacyPolicyUrl?: string; termsOfUseUrl?: string }) => void;
  setRewardConfig: (config: {
    attendanceReward?: number;
    communityReward?: number;
    rankReward?: number;
    trainingReward?: number;
  }) => void;
  setPriceConfig: (config: { changeNicknamePrice?: number; hintPrice?: number }) => void;
}

const useConfigStore = create<ConfigStoreState>((set) => ({
  feedbackUrl: null,
  iosStoreUrl: null,
  androidStoreUrl: null,
  privacyPolicyUrl: null,
  termsOfUseUrl: null,
  attendanceReward: null,
  changeNicknamePrice: null,
  communityReward: null,
  hintPrice: null,
  rankReward: null,
  trainingReward: null,
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
  setRewardConfig: ({ attendanceReward, communityReward, rankReward, trainingReward }) =>
    set((state) => ({
      attendanceReward: attendanceReward ?? state.attendanceReward,
      communityReward: communityReward ?? state.communityReward,
      rankReward: rankReward ?? state.rankReward,
      trainingReward: trainingReward ?? state.trainingReward,
    })),
  setPriceConfig: ({ changeNicknamePrice, hintPrice }) =>
    set((state) => ({
      changeNicknamePrice: changeNicknamePrice ?? state.changeNicknamePrice,
      hintPrice: hintPrice ?? state.hintPrice,
    })),
}));

export default useConfigStore;
