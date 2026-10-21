import axios, { InternalAxiosRequestConfig } from 'axios';
import { APP_KEY_HEADER, HTTP_HEADERS, HTTP_HEADERS_VALUES, REQUEST_TIMEOUT_MS } from './constants';
import useAuthStore from '../store/useAuthStore';
import { reissueToken } from './auth';
import useNetworkStore from '../store/useNetworkStore';
import { getApiErrorMessage } from './errorMessage';
import i18n from '../locales/i18n';
import { ApiError } from './apiError';

declare module 'axios' {
  interface AxiosRequestConfig {
    // 결제 검증처럼 오류 코드와 HTTP 상태를 구분해야 하는 호출에서만 사용한다
    includeErrorDetails?: boolean;
    // 실패해도 대신할 방법이 있는 요청은 네트워크 오류 모달을 띄우지 않는다
    skipNetworkErrorModal?: boolean;
    // 사용자가 기다리지 않는 요청은 "연결 중" 안내를 띄우지 않는다
    skipLoadingIndicator?: boolean;
    // 토큰 재발급 후 다시 보낸 요청도 처음 보낸 시각부터 센다
    requestStartedAt?: number;
    slowRequestTracker?: SlowRequestTracker;
  }
}

// 응답을 받지 못한 경우: 연결 실패, 연결 중단, 시간 초과
const NO_RESPONSE_ERROR_CODES = ['ERR_NETWORK', 'ECONNABORTED', 'ETIMEDOUT'];

// 로그인 토큰이 잘못되어 다시 로그인해야 하는 경우
const INVALID_SESSION_ERROR_CODES = ['J4011', 'J4012', 'J4013', 'J4014'];

export const isNoResponseError = (error: any) =>
  error?.message === 'Network Error' || NO_RESPONSE_ERROR_CODES.includes(error?.code);

const SLOW_REQUEST_DELAY_MS = 2 * 1000;

// 처음 보낸 지 2초가 지나도 응답이 없으면 "연결 중" 안내에 센다
class SlowRequestTracker {
  private timer: ReturnType<typeof setTimeout> | null = null;
  private isCounted = false;

  constructor(startedAt: number) {
    const delay = startedAt + SLOW_REQUEST_DELAY_MS - Date.now();
    if (delay <= 0) {
      this.count();
    } else {
      this.timer = setTimeout(() => this.count(), delay);
    }
  }

  private count() {
    this.timer = null;
    this.isCounted = true;
    useNetworkStore.getState().addSlowRequest();
  }

  finish() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.isCounted) {
      this.isCounted = false;
      useNetworkStore.getState().removeSlowRequest();
    }
  }
}

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
    if (!config.skipLoadingIndicator) {
      config.requestStartedAt ??= Date.now();
      config.slowRequestTracker = new SlowRequestTracker(config.requestStartedAt);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: any) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: unknown, token: string | null = null) => {
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
  (response) => {
    response.config.slowRequestTracker?.finish();
    return response;
  },
  async (error) => {
    error.config?.slowRequestTracker?.finish();

    if (isNoResponseError(error)) {
      console.log('서버 응답 없음 감지:', error.code);

      if (!error.config?.skipNetworkErrorModal) {
        useNetworkStore.getState().setNetworkError(true);
      }

      return Promise.reject(error);
    }

    if (axios.isAxiosError(error)) {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
      // 가입·비밀번호 재설정은 로그인 토큰 없이 이메일 인증 토큰만 보낸다
      const isAuthenticatedRequest = !!originalRequest?.headers?.[HTTP_HEADERS.AUTHORIZATION];

      const errorCode = error.response?.data?.errorResponse?.code;

      // 로그인 토큰 없이 받은 J4010은 이메일 인증 토큰(5분)이 만료된 것이므로 재발급하지 않는다
      if (errorCode === 'J4010' && !isAuthenticatedRequest) {
        return Promise.reject(i18n.t('toast.verificationExpired'));
      }

      if (isAuthenticatedRequest && INVALID_SESSION_ERROR_CODES.includes(errorCode)) {
        console.log('잘못된 로그인 토큰, 로그아웃:', errorCode);
        await useAuthStore.getState().clearTokens();
        return Promise.reject(i18n.t('toast.sessionExpired'));
      }

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
          const sessionExpired = i18n.t('toast.sessionExpired');
          processQueue(sessionExpired); // Fail all queued requests as no refresh token
          return Promise.reject(sessionExpired);
        }

        const reissueTracker = originalRequest.skipLoadingIndicator
          ? undefined
          : new SlowRequestTracker(originalRequest.requestStartedAt ?? Date.now());

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

          // 응답을 받지 못했거나 서버 오류라면 토큰은 그대로 두고, 다음 요청 때 다시 재발급한다
          const isTemporaryFailure =
            isNoResponseError(refreshError) ||
            (axios.isAxiosError(refreshError) && (refreshError.response?.status ?? 0) >= 500);

          if (isTemporaryFailure) {
            if (isNoResponseError(refreshError) && !originalRequest.skipNetworkErrorModal) {
              useNetworkStore.getState().setNetworkError(true);
            }
            const failure =
              axios.isAxiosError(refreshError) && refreshError.response
                ? getApiErrorMessage(refreshError.response.data?.errorResponse)
                : refreshError;
            processQueue(failure); // Fail all queued requests
            isRefreshing = false;
            return Promise.reject(failure);
          }

          // 서버가 재발급을 거절했으므로 다시 로그인해야 한다
          await clearTokens();
          const sessionExpired = i18n.t('toast.sessionExpired');
          processQueue(sessionExpired); // Fail all queued requests
          isRefreshing = false;
          return Promise.reject(sessionExpired);
        } finally {
          reissueTracker?.finish();
          // Even though we manage `isRefreshing` on reissue success/failure,
          // it's important to ensure it is reset when queue is empty
          if (failedQueue.length === 0) {
            isRefreshing = false;
          }
        }
      }
    }
    const errorResponse = error.response?.data?.errorResponse;
    const message = getApiErrorMessage(errorResponse);
    return Promise.reject(
      error.config?.includeErrorDetails
        ? new ApiError(message, errorResponse?.code, error.response?.status)
        : message,
    );
  },
);

export default apiClient;
