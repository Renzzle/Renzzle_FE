import { create } from 'zustand';

interface ConfigStoreState {
  feedbackUrl: string | null;
  setFeedbackUrl: (url: string) => void;
}

const useConfigStore = create<ConfigStoreState>((set) => ({
  feedbackUrl: null,
  setFeedbackUrl: (url) => set({ feedbackUrl: url }),
}));

export default useConfigStore;
