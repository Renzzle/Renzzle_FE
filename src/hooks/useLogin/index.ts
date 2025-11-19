import { getAuth } from '../../apis/auth';
import { HTTP_HEADERS } from '../../apis/constants';
import apiClient from '../../apis/interceptor';
import useAuthStore from '../../store/useAuthStore';
import { useUserStore } from '../../store/useUserStore';

export const useLogin = () => {
  const setTokens = useAuthStore((state) => state.setTokens);
  const updateUser = useUserStore((state) => state.updateUser);

  const login = async (email: string, password: string) => {
    try {
      // API 호출
      const { response } = await getAuth(email, password);
      const { accessToken, refreshToken } = response;

      // Axios 헤더 즉시 설정
      apiClient.defaults.headers.common[HTTP_HEADERS.AUTHORIZATION] = `Bearer ${accessToken}`;

      // Store에 토큰 저장
      await setTokens(accessToken, refreshToken);

      // 유저 정보 가져오기
      await updateUser();

      return true;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  return { login };
};
