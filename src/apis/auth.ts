import axios from 'axios';
import apiClient from './interceptor';

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
    const response = await axios.post('/api/auth/reissueToken', { refreshToken });

    return response.data;
  } catch (error) {
    throw error;
  }
};
