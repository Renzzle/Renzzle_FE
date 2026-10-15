import { create } from 'zustand';

interface NetworkStoreState {
  isNetworkError: boolean;
  setNetworkError: (status: boolean) => void;
  // 2초 넘게 응답을 기다리는 요청 수. 0보다 크면 "연결 중" 안내를 띄운다
  slowRequestCount: number;
  addSlowRequest: () => void;
  removeSlowRequest: () => void;
}

const useNetworkStore = create<NetworkStoreState>((set) => ({
  isNetworkError: false,
  setNetworkError: (status) => set({ isNetworkError: status }),
  slowRequestCount: 0,
  addSlowRequest: () => set((state) => ({ slowRequestCount: state.slowRequestCount + 1 })),
  removeSlowRequest: () =>
    set((state) => ({ slowRequestCount: Math.max(0, state.slowRequestCount - 1) })),
}));

export default useNetworkStore;
