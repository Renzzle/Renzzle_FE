import axios, { InternalAxiosRequestConfig } from 'axios';
import { HTTP_HEADERS, HTTP_HEADERS_VALUES } from './constants';
import useAuthStore from '../store/useAuthStore';
import { reissueToken } from './auth';

export const apiClient = axios.create({
  baseURL: `${process.env.API_URL}`,
  headers: {
    [HTTP_HEADERS.CONTENT_TYPE]: HTTP_HEADERS_VALUES.JSON,
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
  failedQueue = []; // clear queue
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
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

        const { refreshToken, setTokens, signout } = useAuthStore.getState();

        if (!refreshToken) {
          console.log('No refresh token available, signing out.');
          await signout();
          isRefreshing = false;
          processQueue(new Error('No refresh token available for reissue.')); // Fail all queued requests as no refresh token
          return Promise.reject(error);
        }

        try {
          console.log('J4010: Access Token 만료!! 토큰 재발급 시도 중...');
          const { newAccessToken, newRefreshToken } = await reissueToken(refreshToken);
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
          await signout();
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
