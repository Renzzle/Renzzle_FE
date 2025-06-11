import axios from 'axios';
import apiClient from './interceptor';
import { HTTP_HEADERS, HTTP_HEADERS_VALUES } from './constants';

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
        headers: {
          [HTTP_HEADERS.CONTENT_TYPE]: HTTP_HEADERS_VALUES.JSON,
        },
      },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
