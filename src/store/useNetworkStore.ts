import { create } from 'zustand';

interface NetworkStoreState {
  isNetworkError: boolean;
  setNetworkError: (status: boolean) => void;
}

const useNetworkStore = create<NetworkStoreState>((set) => ({
  isNetworkError: false,
  setNetworkError: (status) => set({ isNetworkError: status }),
}));

export default useNetworkStore;
