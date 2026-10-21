import { getAuth } from '../../apis/auth';
import useAuthStore from '../../store/useAuthStore';
import useConfigStore from '../../store/useConfigStore';
import { useUserStore } from '../../store/useUserStore';

export const useLogin = () => {
  const setTokens = useAuthStore((state) => state.setTokens);
  const updateUser = useUserStore((state) => state.updateUser);
  const loadAppData = useConfigStore((state) => state.loadAppData);

  const login = async (email: string, password: string) => {
    try {
      // API 호출
      const { response } = await getAuth(email, password);
      const { accessToken, refreshToken } = response;

      // Store에 토큰 저장 (요청 인터셉터가 매 요청마다 이 토큰으로 헤더를 붙인다)
      await setTokens(accessToken, refreshToken);

      // 유저 정보와 앱 설정 가져오기 (앱 설정은 로그인해야 받을 수 있다)
      await Promise.all([updateUser(), loadAppData()]);

      return true;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  return { login };
};
