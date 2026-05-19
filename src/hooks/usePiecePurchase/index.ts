import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  ErrorCode,
  finishTransaction,
  getProducts,
  initConnection,
  isUserCancelledError,
  Product,
  purchaseErrorListener,
  purchaseUpdatedListener,
  requestPurchase,
} from 'react-native-iap';
import { PIECE_PRODUCT_IDS, PieceProductId } from '../../constants/iap';
import { useUserStore } from '../../store/useUserStore';
import { showBottomToast } from '../../components/common/Toast/toastMessage';

interface UsePiecePurchaseOptions {
  onPurchaseComplete?: () => void | Promise<void>;
}

const isPieceProductId = (productId: string): productId is PieceProductId =>
  PIECE_PRODUCT_IDS.includes(productId as PieceProductId);

const usePiecePurchase = ({ onPurchaseComplete }: UsePiecePurchaseOptions = {}) => {
  const { t } = useTranslation();
  const updateUser = useUserStore((state) => state.updateUser);
  const [products, setProducts] = useState<Product[]>([]);
  const [isStoreReady, setIsStoreReady] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<PieceProductId | null>(null);

  const resetSelection = useCallback(() => {
    setSelectedProductId(null);
  }, []);

  const loadPieceProducts = useCallback(async () => {
    const nextProducts = await getProducts({ skus: [...PIECE_PRODUCT_IDS] });
    setProducts(nextProducts);
    return nextProducts;
  }, []);

  const ensureStoreReady = useCallback(async () => {
    if (isStoreReady) {
      return true;
    }

    try {
      const connected = await initConnection();
      setIsStoreReady(connected);

      if (connected) {
        await loadPieceProducts();
      }

      return connected;
    } catch (error) {
      console.log('스토어 연결 실패:', error);
      setIsStoreReady(false);
      return false;
    }
  }, [isStoreReady, loadPieceProducts]);

  useEffect(() => {
    ensureStoreReady();
  }, [ensureStoreReady]);

  useEffect(() => {
    const purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase) => {
      if (!isPieceProductId(purchase.productId)) {
        return;
      }

      try {
        // TODO: 추후 서버 API 추가되면 검증로직 추가
        await finishTransaction({ purchase, isConsumable: true });
        await updateUser();
        setSelectedProductId(null);
        await onPurchaseComplete?.();
        showBottomToast('success', t('toast.purchaseComplete'));
      } catch (error) {
        console.log('퍼즐 조각 구매 처리 실패:', error);
        showBottomToast('error', t('toast.purchaseFailed'));
      }
    });

    const purchaseErrorSubscription = purchaseErrorListener((error) => {
      const isCancelled =
        isUserCancelledError(error) ||
        error?.code === ErrorCode.E_USER_CANCELLED ||
        error?.message?.toLowerCase().includes('cancel');

      setSelectedProductId(null);
      if (isCancelled) {
        return;
      }

      console.log('퍼즐 조각 구매 실패:', error);
      showBottomToast('error', t('toast.purchaseFailed'));
    });

    return () => {
      purchaseUpdateSubscription.remove();
      purchaseErrorSubscription.remove();
    };
  }, [onPurchaseComplete, t, updateUser]);

  const purchasePiece = useCallback(
    async (productId: PieceProductId) => {
      const storeReady = await ensureStoreReady();
      if (!storeReady) {
        showBottomToast('error', t('toast.storeNotConnected'));
        return;
      }

      const currentProducts = products.length > 0 ? products : await loadPieceProducts();
      const product = currentProducts.find((item) => item.productId === productId);
      if (!product) {
        showBottomToast('error', t('toast.productUnavailable'));
        return;
      }

      try {
        setSelectedProductId(productId);
        if (Platform.OS === 'android') {
          await requestPurchase({ skus: [productId] });
        } else {
          await requestPurchase({ sku: productId });
        }
      } catch (error: any) {
        const isCancelled =
          isUserCancelledError(error) ||
          error?.code === ErrorCode.E_USER_CANCELLED ||
          error?.message?.toLowerCase().includes('cancel');

        setSelectedProductId(null);
        if (isCancelled) {
          return;
        }

        console.log('퍼즐 조각 구매 요청 실패:', error);
        showBottomToast('error', t('toast.purchaseFailed'));
      }
    },
    [ensureStoreReady, loadPieceProducts, products, t],
  );

  return {
    products,
    selectedProductId,
    isStoreReady,
    purchasePiece,
    resetSelection,
  };
};

export default usePiecePurchase;
