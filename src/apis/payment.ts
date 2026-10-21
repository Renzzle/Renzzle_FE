import { Platform } from 'react-native';
import { Purchase } from 'react-native-iap';
import apiClient from './interceptor';

type InAppPurchasePlatform = 'ANDROID' | 'IOS';

interface VerifyInAppPurchaseRequest {
  platform: InAppPurchasePlatform;
  productId: string;
  transactionId: string;
  purchaseToken: string;
  receipt: string;
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

const buildVerifyInAppPurchaseRequest = (purchase: Purchase): VerifyInAppPurchaseRequest => ({
  platform: getInAppPurchasePlatform(),
  productId: purchase.productId,
  transactionId: purchase.transactionId ?? '',
  purchaseToken: purchase.purchaseToken ?? '',
  receipt:
    purchase.transactionReceipt || purchase.jwsRepresentationIos || purchase.dataAndroid || '',
});

export const verifyInAppPurchase = async (purchase: Purchase) => {
  try {
    const response = await apiClient.post(
      '/api/payments/in-app/verify',
      buildVerifyInAppPurchaseRequest(purchase),
      { includeErrorDetails: true },
    );

    return response.data.response as VerifyInAppPurchaseResponse;
  } catch (error) {
    throw error;
  }
};
