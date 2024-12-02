import axios, { AxiosResponse } from 'axios';
import { HTTP_HEADERS, HTTP_HEADERS_VALUES } from './constants';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const apiClient = axios.create({
  baseURL: `${process.env.API_URL}`,
  headers: {
    [HTTP_HEADERS.CONTENT_TYPE]: HTTP_HEADERS_VALUES.JSON,
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error!!: ' + error);
    const errorResponse = error.response?.data?.errorResponse;
    const errorMessage = errorResponse?.message || error.message || 'An unknown error occurred.';
    const errorStatus = errorResponse?.status || 'Unknown Status';
    const errorCode = errorResponse?.code || error.code || 'Unknown Code';
    console.error('errorMessage: ' + errorMessage);
    console.error('errorStatus: ' + errorStatus);
    console.error('errorCode: ' + errorCode);

    if (axios.isAxiosError(error)) {
      const errorResponse = error.response?.data?.errorResponse;

      const errorMessage = errorResponse?.message || error.message || 'An unknown error occurred.';
      const errorStatus = errorResponse?.status || 'Unknown Status';
      const errorCode = errorResponse?.code || error.code || 'Unknown Code';
      // const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

      if (errorCode === 'J4010') {
        console.log('Access Token 만료!!');
        // navigation.navigate('Signin');
        return Promise.resolve({
          data: null,
          status: 401,
          statusText: 'Unauthorized',
          headers: {},
          config: error.config,
        } as AxiosResponse<any>);
      }

      console.error(`Axios Error: ${errorMessage}
        Status: ${errorStatus}
        Code: ${errorCode}`);
      console.error('Request Config:', error.config);
      if (error.request) {
        console.error('Request:', error.request);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
