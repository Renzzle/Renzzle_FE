import { Platform } from 'react-native';

type IapProductIds = {
  REMOVE_ADS: string;
  PIECE_1000: string;
  PIECE_5000: string;
  PIECE_10000: string;
};

const ANDROID_IAP_PRODUCT_IDS: IapProductIds = {
  REMOVE_ADS: 'remove_ads',
  PIECE_1000: 'piece_1000',
  PIECE_5000: 'piece_5000',
  PIECE_10000: 'piece_10000',
};

const IOS_IAP_PRODUCT_IDS: IapProductIds = {
  REMOVE_ADS: 'com.renzzle.removeads',
  PIECE_1000: 'com.renzzle.piece1000',
  PIECE_5000: 'com.renzzle.piece5000',
  PIECE_10000: 'com.renzzle.piece10000',
};

export const IAP_PRODUCT_IDS =
  Platform.select({
    ios: IOS_IAP_PRODUCT_IDS,
    android: ANDROID_IAP_PRODUCT_IDS,
    default: ANDROID_IAP_PRODUCT_IDS,
  }) ?? ANDROID_IAP_PRODUCT_IDS;

export const PIECE_PRODUCTS = [
  { pieces: 1000, productId: IAP_PRODUCT_IDS.PIECE_1000 },
  { pieces: 5000, productId: IAP_PRODUCT_IDS.PIECE_5000 },
  { pieces: 10000, productId: IAP_PRODUCT_IDS.PIECE_10000 },
] as const;

export type PieceProductId = (typeof PIECE_PRODUCTS)[number]['productId'];

export const PIECE_PRODUCT_IDS = PIECE_PRODUCTS.map((product) => product.productId);

export const ALL_IAP_PRODUCT_IDS = [IAP_PRODUCT_IDS.REMOVE_ADS, ...PIECE_PRODUCT_IDS];
