import { Platform } from 'react-native';
import { Purchase } from 'react-native-iap';
import apiClient from './interceptor';

type InAppPurchasePlatform = 'ANDROID' | 'IOS';

interface VerifyInAppPurchaseRequest {
  platform: InAppPurchasePlatform;
  productId: string;
  transactionId: string;
  purchaseToken: string;
}

export interface VerifyInAppPurchaseResponse {
  platform: string;
  productId: string;
  grantedCurrency: number;
}

const getInAppPurchasePlatform = (): InAppPurchasePlatform => {
  if (Platform.OS === 'ios') {
    return 'IOS';
  }

  return 'ANDROID';
};

// The server checks the purchase with the store by its transaction ID or purchase token, so the receipt is not sent
const buildVerifyInAppPurchaseRequest = (
  purchase: Purchase,
  transactionId: string,
): VerifyInAppPurchaseRequest => ({
  platform: getInAppPurchasePlatform(),
  productId: purchase.productId,
  transactionId,
  // On iOS this holds the signed transaction, which the server does not use
  purchaseToken: Platform.OS === 'android' ? purchase.purchaseToken ?? '' : '',
});

interface VerifyInAppPurchaseOptions {
  // An Apple restore creates a new transaction, so the original transaction's ID is sent instead
  transactionId?: string;
  // Retrying a purchase the user is not waiting on
  background?: boolean;
}

export const verifyInAppPurchase = async (
  purchase: Purchase,
  { transactionId = purchase.transactionId ?? '', background = false }: VerifyInAppPurchaseOptions = {},
) => {
  const response = await apiClient.post(
    '/api/payments/in-app/verify',
    buildVerifyInAppPurchaseRequest(purchase, transactionId),
    {
      includeErrorDetails: true,
      skipNetworkErrorModal: background,
      skipLoadingIndicator: background,
    },
  );

  return response.data.response as VerifyInAppPurchaseResponse;
};
