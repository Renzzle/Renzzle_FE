import { AxiosError, AxiosAdapter } from 'axios';
import apiClient from '../src/apis/interceptor';
import { ApiError } from '../src/apis/apiError';
import { verifyInAppPurchase } from '../src/apis/payment';
import { Purchase } from 'react-native-iap';

jest.mock('../src/apis/auth', () => ({ reissueToken: jest.fn() }));
jest.mock('../src/store/useAuthStore', () => ({
  __esModule: true,
  default: { getState: () => ({ accessToken: 'test-access-token' }) },
}));
jest.mock('../src/store/useNetworkStore', () => ({
  __esModule: true,
  default: {
    getState: () => ({
      setNetworkError: jest.fn(),
      addSlowRequest: jest.fn(),
      removeSlowRequest: jest.fn(),
    }),
  },
}));
jest.mock('../src/locales/i18n', () => ({ t: (key: string) => key, exists: () => true }));

const initialAdapter = apiClient.defaults.adapter;
const rejectingAdapter: AxiosAdapter = async (config) => {
  throw new AxiosError(
    'Request failed with status code 409',
    'ERR_BAD_REQUEST',
    config,
    undefined,
    {
      status: 409,
      statusText: 'Conflict',
      headers: {},
      config,
      data: {
        isSuccess: false,
        errorResponse: { code: 'I4090', message: 'Receipt already processed' },
      },
    },
  );
};
beforeEach(() => {
  apiClient.defaults.adapter = rejectingAdapter;
});
afterEach(() => {
  apiClient.defaults.adapter = initialAdapter;
});

it('preserves the payment verification error code and status through the interceptor', async () => {
  const event = {
    productId: 'com.renzzle.piece1000',
    transactionId: 'transaction-1',
    transactionReceipt: 'test-receipt',
  } as Purchase;
  const error = await verifyInAppPurchase(event).catch((failure) => failure);
  expect(error).toBeInstanceOf(ApiError);
  expect(error).toMatchObject({
    code: 'I4090',
    status: 409,
    message: 'error.alreadyProcessedReceipt',
  });
  expect(error).not.toHaveProperty('config');
  expect(error).not.toHaveProperty('response');
});

it('retains string errors for existing API callers that do not opt in', async () => {
  await expect(apiClient.get('/api/user')).rejects.toBe('error.alreadyProcessedReceipt');
});
