import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Platform } from 'react-native';
import {
  ErrorCode,
  finishTransaction,
  getAvailablePurchases,
  isUserCancelledError,
  Purchase,
  purchaseErrorListener,
  purchaseUpdatedListener,
  requestPurchase,
} from 'react-native-iap';
import { verifyInAppPurchase } from '../apis/payment';
import { showBottomToast } from '../components/common/Toast/toastMessage';
import { ALL_IAP_PRODUCT_IDS, IAP_PRODUCT_IDS } from '../constants/iap';
import i18n from '../locales/i18n';
import usePurchaseStore from '../store/usePurchaseStore';
import { useUserStore } from '../store/useUserStore';
import { useIapProducts } from './IapProductsProvider';
import { ApiError } from '../apis/apiError';

type PurchaseCompleteCallback = () => void | Promise<void>;

interface PurchaseRequest {
  productId: string;
  onComplete?: PurchaseCompleteCallback;
  errorHandled?: boolean;
}

interface IapPurchaseContextValue {
  pendingProductId: string | null;
  purchaseProduct: (productId: string, onComplete?: PurchaseCompleteCallback) => Promise<void>;
}

const IapPurchaseContext = createContext<IapPurchaseContextValue | null>(null);

export const IapPurchaseProvider = ({ children }: React.PropsWithChildren) => {
  const { connected, loadProducts } = useIapProducts();
  const [pendingProductId, setPendingProductId] = useState<string | null>(null);
  const activeRequest = useRef<PurchaseRequest | null>(null);
  const processing = useRef(new Map<string, { productId: string; promise: Promise<void> }>());
  const verified = useRef(new Set<string>());
  const finished = useRef(new Set<string>());
  const completed = useRef(new Set<string>());

  const updatePendingProduct = useCallback(() => {
    const nextProcessing = processing.current.values().next().value;
    setPendingProductId(activeRequest.current?.productId ?? nextProcessing?.productId ?? null);
  }, []);

  const clearRequest = useCallback(
    (request: PurchaseRequest) => {
      if (activeRequest.current === request) {
        activeRequest.current = null;
        updatePendingProduct();
      }
    },
    [updatePendingProduct],
  );

  const processPurchase = useCallback(
    (purchase: Purchase, restored = false): Promise<void> => {
      if (!ALL_IAP_PRODUCT_IDS.includes(purchase.productId)) {
        return Promise.resolve();
      }

      // A product ID alone cannot identify repeated purchases of a consumable.
      const transactionId =
        Platform.OS === 'android'
          ? purchase.purchaseToken || purchase.transactionId
          : purchase.transactionId;
      if (!transactionId) {
        const request = activeRequest.current;
        if (request?.productId === purchase.productId) {
          clearRequest(request);
        }
        showBottomToast('error', i18n.t('toast.purchaseFailed'));
        return Promise.resolve();
      }

      const userId = useUserStore.getState().user?.id;
      const key = `${userId}:${Platform.OS}:${transactionId}`;
      if (completed.current.has(key)) {
        return Promise.resolve();
      }
      const pending = processing.current.get(key);
      if (pending) {
        return pending.promise;
      }

      const request =
        activeRequest.current?.productId === purchase.productId ? activeRequest.current : null;

      // Register the lock before any async work, including verification and finishing.
      const promise = Promise.resolve().then(async () => {
        try {
          if (!verified.current.has(key)) {
            await verifyInAppPurchase(purchase);
            verified.current.add(key);
          }
          if (useUserStore.getState().user?.id !== userId) {
            return;
          }
          if (!finished.current.has(key)) {
            await finishTransaction({
              purchase,
              isConsumable: purchase.productId !== IAP_PRODUCT_IDS.REMOVE_ADS,
            });
            finished.current.add(key);
          }

          if (useUserStore.getState().user?.id !== userId) {
            return;
          }

          if (purchase.productId === IAP_PRODUCT_IDS.REMOVE_ADS) {
            await usePurchaseStore.getState().setAdsRemoved(true);
          } else {
            await useUserStore.getState().updateUser();
          }
          completed.current.add(key);
          showBottomToast(
            'success',
            i18n.t(restored ? 'toast.removeAdsRestored' : 'toast.purchaseComplete'),
          );
        } catch (error) {
          // Leave the transaction unfinished when server verification fails.
          showBottomToast(
            'error',
            error instanceof ApiError ? error.message : i18n.t('toast.purchaseFailed'),
          );
          return;
        } finally {
          processing.current.delete(key);
          if (request) {
            clearRequest(request);
          }
          updatePendingProduct();
        }

        // A modal callback failure must not turn a completed purchase into a failure.
        try {
          await request?.onComplete?.();
        } catch {
          // The purchase has already completed; a UI callback cannot change its result.
        }
      });
      processing.current.set(key, { productId: purchase.productId, promise });
      updatePendingProduct();
      return promise;
    },
    [clearRequest, updatePendingProduct],
  );

  const handleRequestError = useCallback(
    async (request: PurchaseRequest, error: unknown) => {
      // Native purchase-error and the request promise can report the same failure.
      if (activeRequest.current !== request || request.errorHandled) {
        return;
      }
      request.errorHandled = true;
      const purchaseError = error as { code?: string; message?: string } | null;
      const cancelled =
        isUserCancelledError(error) ||
        purchaseError?.code === ErrorCode.E_USER_CANCELLED ||
        purchaseError?.message?.toLowerCase().includes('cancel');
      try {
        if (cancelled) {
          return;
        }
        if (
          purchaseError?.code === ErrorCode.E_ALREADY_OWNED &&
          request.productId === IAP_PRODUCT_IDS.REMOVE_ADS
        ) {
          const purchases = await getAvailablePurchases();
          const removeAds = purchases.find(
            (purchase) => purchase.productId === IAP_PRODUCT_IDS.REMOVE_ADS,
          );
          if (removeAds) {
            await processPurchase(removeAds, true);
            return;
          }
        }
        showBottomToast('error', i18n.t('toast.purchaseFailed'));
      } catch {
        showBottomToast('error', i18n.t('toast.purchaseFailed'));
      } finally {
        clearRequest(request);
      }
    },
    [clearRequest, processPurchase],
  );

  useEffect(() => {
    if (!connected) {
      return;
    }
    const updates = purchaseUpdatedListener((purchase) => processPurchase(purchase));
    const errors = purchaseErrorListener((error) => {
      const request = activeRequest.current;
      if (request && (!error.productId || error.productId === request.productId)) {
        return handleRequestError(request, error);
      }
    });
    return () => {
      updates.remove();
      errors.remove();
    };
  }, [connected, handleRequestError, processPurchase]);

  const purchaseProduct = useCallback(
    async (productId: string, onComplete?: PurchaseCompleteCallback) => {
      if (activeRequest.current || processing.current.size > 0) {
        return;
      }
      if (!connected) {
        showBottomToast('error', i18n.t('toast.storeNotConnected'));
        return;
      }
      if (!ALL_IAP_PRODUCT_IDS.includes(productId)) {
        showBottomToast('error', i18n.t('toast.productUnavailable'));
        return;
      }

      // A ref guards rapid taps before React has rendered the disabled state.
      const request: PurchaseRequest = { productId, onComplete };
      activeRequest.current = request;
      updatePendingProduct();
      try {
        const products = await loadProducts();
        if (!products.some((product) => product.productId === productId)) {
          showBottomToast('error', i18n.t('toast.productUnavailable'));
          clearRequest(request);
          return;
        }
        if (Platform.OS === 'android') {
          await requestPurchase({ skus: [productId] });
        } else {
          await requestPurchase({ sku: productId });
        }
        // Keep the request busy until the update listener finishes the transaction.
      } catch (error) {
        await handleRequestError(request, error);
      }
    },
    [clearRequest, connected, handleRequestError, loadProducts, updatePendingProduct],
  );

  const value = useMemo(
    () => ({ pendingProductId, purchaseProduct }),
    [pendingProductId, purchaseProduct],
  );
  return <IapPurchaseContext.Provider value={value}>{children}</IapPurchaseContext.Provider>;
};

export const useIapPurchase = () => {
  const context = useContext(IapPurchaseContext);
  if (!context) {
    throw new Error('useIapPurchase must be used within IapPurchaseProvider');
  }
  return context;
};
