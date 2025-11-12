import { create } from 'zustand';
import { getUser } from '../apis/user';

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

  /**
   * 서버에서 최신 유저 정보를 다시 불러와 스토어를 갱신
   * 재화(currency) 변경, 닉네임 수정 등 사용자 정보에 수정 사항이 발생한 뒤 호출
   */
  updateUser: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),

  updateUser: async () => {
    try {
      const user = await getUser();
      set({ user });
    } catch (error) {
      console.log('Failed to update user in store:', error);
      set({ user: null });
    }
  },
}));
