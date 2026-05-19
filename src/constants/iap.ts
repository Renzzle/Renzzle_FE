export const IAP_PRODUCT_IDS = {
  REMOVE_ADS: 'remove_ads',
  PIECE_1000: 'piece_1000',
  PIECE_5000: 'piece_5000',
  PIECE_10000: 'piece_10000',
} as const;

export const PIECE_PRODUCTS = [
  { pieces: 1000, productId: IAP_PRODUCT_IDS.PIECE_1000 },
  { pieces: 5000, productId: IAP_PRODUCT_IDS.PIECE_5000 },
  { pieces: 10000, productId: IAP_PRODUCT_IDS.PIECE_10000 },
] as const;

export type PieceProductId = (typeof PIECE_PRODUCTS)[number]['productId'];

export const PIECE_PRODUCT_IDS = PIECE_PRODUCTS.map((product) => product.productId);
