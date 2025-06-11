import { create } from 'zustand';

export interface User {
  id: number;
  email: string;
  nickname: string;
  currency: number;
}

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  updateCurrency: (currency: number) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  updateCurrency: (currency) =>
    set((state) => (state.user ? { user: { ...state.user, currency } } : state)),
}));
