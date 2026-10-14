import axios from 'axios';
import apiClient from './interceptor';
import {
  APP_KEY_HEADER,
  HTTP_HEADERS,
  HTTP_HEADERS_VALUES,
  REQUEST_TIMEOUT_MS,
} from './constants';

export const updateEmailAuthCode = async (email: string) => {
  try {
    const response = await apiClient.post('/api/auth/email', { email });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const confirmCode = async (email: string, code: string) => {
  try {
    const response = await apiClient.post('/api/auth/confirmCode', { email, code });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkNicknameDuplicate = async (nickname: string) => {
  try {
    const response = await apiClient.get(`/api/auth/duplicate/${nickname}`);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (
  email: string,
  password: string,
  nickname: string,
  authVerityToken: string,
  deviceId: string,
) => {
  try {
    const response = await apiClient.post('/api/auth/signup', {
      email,
      password,
      nickname,
      authVerityToken,
      deviceId,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendPasswordResetCode = async (email: string) => {
  try {
    const response = await apiClient.post('/api/auth/password/reset/email', { email });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (
  email: string,
  authVerityToken: string,
  newPassword: string,
) => {
  try {
    const response = await apiClient.patch('/api/auth/password/reset', {
      email,
      authVerityToken,
      newPassword,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
  try {
    const response = await apiClient.patch('/api/auth/password', { currentPassword, newPassword });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAuth = async (email: string, password: string) => {
  try {
    const response = await apiClient.post('/api/auth/login', { email, password });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const reissueToken = async (refreshToken: string) => {
  try {
    // prevent infinite loop
    const response = await axios.post(
      `${process.env.API_URL}/api/auth/reissueToken`,
      { refreshToken },
      {
        // 재발급이 멈추면 재발급을 기다리는 요청도 전부 멈추므로 시간 제한을 둔다
        timeout: REQUEST_TIMEOUT_MS,
        headers: {
          [HTTP_HEADERS.CONTENT_TYPE]: HTTP_HEADERS_VALUES.JSON,
          ...APP_KEY_HEADER,
        },
      },
    );

    return response.data.response;
  } catch (error) {
    throw error;
  }
};
