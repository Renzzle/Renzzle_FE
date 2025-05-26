import axios from 'axios';
import { HTTP_HEADERS, HTTP_HEADERS_VALUES } from './constants';
import useAuthStore from '../store/useAuthStore';

export const apiClient = axios.create({
  baseURL: `${process.env.API_URL}`,
  headers: {
    [HTTP_HEADERS.CONTENT_TYPE]: HTTP_HEADERS_VALUES.JSON,
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isAxiosError(error)) {
      const errorCode = error.response?.data?.errorResponse?.code;

      if (errorCode === 'J4010') {
        console.log('Access Token 만료!!');
        // TODO: token test
        await useAuthStore.getState().signout();
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
