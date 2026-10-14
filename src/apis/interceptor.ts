import axios, { InternalAxiosRequestConfig } from 'axios';
import {
  APP_KEY_HEADER,
  HTTP_HEADERS,
  HTTP_HEADERS_VALUES,
  REQUEST_TIMEOUT_MS,
} from './constants';
import useAuthStore from '../store/useAuthStore';
import { reissueToken } from './auth';
import useNetworkStore from '../store/useNetworkStore';

declare module 'axios' {
  interface AxiosRequestConfig {
    // 실패해도 대신할 방법이 있는 요청은 네트워크 오류 모달을 띄우지 않는다
    skipNetworkErrorModal?: boolean;
  }
}

// 응답을 받지 못한 경우: 연결 실패, 연결 중단, 시간 초과
const NO_RESPONSE_ERROR_CODES = ['ERR_NETWORK', 'ECONNABORTED', 'ETIMEDOUT'];

export const apiClient = axios.create({
  baseURL: `${process.env.API_URL}`,
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    [HTTP_HEADERS.CONTENT_TYPE]: HTTP_HEADERS_VALUES.JSON,
    ...APP_KEY_HEADER,
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers[HTTP_HEADERS.AUTHORIZATION] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: any) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error); // Fail queued requests if reissue fails
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = []; // Clear queue
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.message === 'Network Error' || NO_RESPONSE_ERROR_CODES.includes(error.code)) {
      console.log('서버 응답 없음 감지:', error.code);

      if (!error.config?.skipNetworkErrorModal) {
        useNetworkStore.getState().setNetworkError(true);
      }

      return Promise.reject(error);
    }

    if (axios.isAxiosError(error)) {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      const errorCode = error.response?.data?.errorResponse?.code;
      if (errorCode === 'J4010' && !originalRequest._retry) {
        console.log('Access Token 만료!!');
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(async (newToken) => {
              if (originalRequest.headers && newToken) {
                originalRequest.headers[HTTP_HEADERS.AUTHORIZATION] = `Bearer ${newToken}`;
              }
              return apiClient(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const { refreshToken, setTokens, clearTokens } = useAuthStore.getState();

        if (!refreshToken) {
          console.log('No refresh token available, signing out.');
          await clearTokens();
          isRefreshing = false;
          processQueue(new Error('No refresh token available for reissue.')); // Fail all queued requests as no refresh token
          return Promise.reject(error);
        }

        try {
          console.log('J4010: Access Token 만료!! 토큰 재발급 시도 중...');
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await reissueToken(
            refreshToken,
          );
          if (!newAccessToken) {
            throw new Error('재발급된 액세스 토큰이 유효하지 않습니다.');
          }

          await setTokens(newAccessToken, newRefreshToken); // Save new tokens to store and AsyncStorage
          console.log('토큰 재발급 성공.');

          // Update the original request with the new access token
          if (originalRequest.headers) {
            originalRequest.headers[HTTP_HEADERS.AUTHORIZATION] = `Bearer ${newAccessToken}`;
          }
          processQueue(null, newAccessToken); // Resolve all queued requests with the new token
          return apiClient(originalRequest); // Retry the original request with the new token
        } catch (refreshError) {
          console.log('토큰 재발급 실패:', refreshError);
          await clearTokens();
          processQueue(refreshError as Error); // Fail all queued requests
          isRefreshing = false;
          return Promise.reject(refreshError);
        } finally {
          // Even though we manage `isRefreshing` on reissue success/failure,
          // it's important to ensure it is reset when queue is empty
          if (failedQueue.length === 0) {
            isRefreshing = false;
          }
        }
      }
    }
    console.log(error.response?.data?.errorResponse);
    return Promise.reject(error.response?.data?.errorResponse?.message ?? error);
  },
);

export default apiClient;
