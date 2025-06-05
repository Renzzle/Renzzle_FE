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
