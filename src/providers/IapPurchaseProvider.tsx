import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AppState, Platform } from 'react-native';
import {
  ErrorCode,
  finishTransaction,
  getAvailablePurchases,
  getPendingTransactionsIOS,
  isUserCancelledError,
  Purchase,
  PurchaseAndroid,
  purchaseErrorListener,
  PurchaseIOS,
  purchaseUpdatedListener,
  requestPurchase,
  restorePurchases as syncStorePurchases,
} from 'react-native-iap';
import { ToastType } from 'react-native-toast-message';
import { ApiError } from '../apis/apiError';
import { verifyInAppPurchase } from '../apis/payment';
import { showBottomToast } from '../components/common/Toast/toastMessage';
import { ALL_IAP_PRODUCT_IDS, IAP_PRODUCT_IDS } from '../constants/iap';
import i18n from '../locales/i18n';
import useAuthStore from '../store/useAuthStore';
import { useUserStore } from '../store/useUserStore';
import { useIapProducts } from './IapProductsProvider';

type PurchaseCompleteCallback = () => void | Promise<void>;

// background: replayed by the store or left unfinished earlier, so nobody is waiting on it
// owned: found after the store refused a purchase because the product is already owned
type PurchaseSource = 'request' | 'background' | 'restore' | 'owned';

type VerifyOutcome =
  | { type: 'granted'; grantedCurrency: number }
  | { type: 'alreadyGranted' }
  | { type: 'invalid'; message: string }
  | { type: 'pending' }
  // Server or network trouble: kept and retried soon
  | { type: 'retryLater' }
  // Any other refusal: kept, but retried only on the next launch or return to the app
  | { type: 'rejected'; message: string };

type ToastMessage = [ToastType, string];

interface PurchaseRequest {
  productId: string;
  onComplete?: PurchaseCompleteCallback;
  errorHandled?: boolean;
}

interface IapPurchaseContextValue {
  pendingProductId: string | null;
  purchaseProduct: (productId: string, onComplete?: PurchaseCompleteCallback) => Promise<void>;
  restorePurchases: () => Promise<void>;
}

const RETRY_DELAY_MS = 60 * 1000;

const IapPurchaseContext = createContext<IapPurchaseContextValue | null>(null);

const isConsumable = (productId: string) => productId !== IAP_PRODUCT_IDS.REMOVE_ADS;

const isAcknowledged = (purchase: Purchase) =>
  Platform.OS === 'android' && Boolean((purchase as PurchaseAndroid).isAcknowledgedAndroid);

// Apple gives a re-downloaded purchase a new transaction ID, while the server records the original
// one, so one Apple ID's ad removal stays with one Renzzle account
const getVerifyTransactionId = (purchase: Purchase) =>
  Platform.OS === 'ios'
    ? (purchase as PurchaseIOS).originalTransactionIdentifierIOS ?? purchase.transactionId ?? undefined
    : undefined;

const verifyPurchase = async (
  purchase: Purchase,
  transactionId: string | undefined,
  background: boolean,
): Promise<VerifyOutcome> => {
  try {
    const { grantedCurrency } = await verifyInAppPurchase(purchase, { transactionId, background });
    return { type: 'granted', grantedCurrency };
  } catch (error) {
    if (!(error instanceof ApiError)) {
      return { type: 'retryLater' };
    }
    if (error.code === 'I4090') {
      return { type: 'alreadyGranted' };
    }
    if (error.code === 'I4002') {
      return { type: 'invalid', message: error.message };
    }
    if (error.code === 'I4091') {
      return { type: 'pending' };
    }
    // Finishing on any other refusal would drop a payment the store already took
    return (error.status ?? 500) < 500
      ? { type: 'rejected', message: error.message }
      : { type: 'retryLater' };
  }
};

// false while the store still holds a consumable, so a later recovery finishes it
const finishPurchase = async (purchase: Purchase) => {
  const consumable = isConsumable(purchase.productId);
  // The server acknowledges Android purchases, and Play refuses a second acknowledgement
  if (!consumable && isAcknowledged(purchase)) {
    return true;
  }
  try {
    await finishTransaction({ purchase, isConsumable: consumable });
    return true;
  } catch (error) {
    console.log('Failed to finish purchase:', error);
    return !consumable;
  }
};

const refreshUser = async (productId: string, outcome: VerifyOutcome) => {
  const updated = await useUserStore.getState().updateUser();
  const { user, setUser } = useUserStore.getState();
  if (!updated && user && outcome.type === 'granted') {
    // Show what the server granted even when reloading the user failed
    setUser(
      isConsumable(productId)
        ? { ...user, currency: user.currency + outcome.grantedCurrency }
        : { ...user, adsRemoved: true },
    );
  }
  return updated;
};

const getAlreadyGrantedToast = (productId: string, userUpdated: boolean): ToastMessage => {
  if (!isConsumable(productId)) {
    if (useUserStore.getState().user?.adsRemoved) {
      return ['info', i18n.t('toast.adsAlreadyRemoved')];
    }
    // The server applies a store account's ad removal to one Renzzle account only
    if (userUpdated) {
      return ['info', i18n.t('toast.removeAdsOtherAccount')];
    }
  }
  return ['info', i18n.t('toast.purchaseAlreadyApplied')];
};

const getResultToast = (
  source: PurchaseSource,
  productId: string,
  outcome: VerifyOutcome,
  { finished, userUpdated }: { finished: boolean; userUpdated: boolean },
): ToastMessage | null => {
  if (source === 'background') {
    return outcome.type === 'granted' ? ['success', i18n.t('toast.previousPurchaseApplied')] : null;
  }
  switch (outcome.type) {
    case 'granted':
      if (source === 'restore') {
        return ['success', i18n.t('toast.removeAdsRestored')];
      }
      return [
        'success',
        i18n.t(source === 'owned' ? 'toast.previousPurchaseApplied' : 'toast.purchaseComplete'),
      ];
    case 'alreadyGranted':
      if (source === 'owned' && isConsumable(productId)) {
        return finished
          ? ['info', i18n.t('toast.retryPurchase')]
          : ['error', i18n.t('toast.purchaseFailed')];
      }
      return getAlreadyGrantedToast(productId, userUpdated);
    case 'invalid':
      return ['error', outcome.message];
    case 'pending':
      return ['info', i18n.t('toast.purchasePending')];
    case 'rejected':
      return ['error', outcome.message];
    case 'retryLater':
      // A restored purchase is no longer in the store's queue, so recovery will not pick it up
      return source === 'restore'
        ? ['error', i18n.t('toast.restoreFailed')]
        : ['info', i18n.t('toast.purchaseRetryLater')];
  }
};

export const IapPurchaseProvider = ({ children }: React.PropsWithChildren) => {
  const { connected, loadProducts } = useIapProducts();
  const accessToken = useAuthStore((state) => state.accessToken);
  const [pendingProductId, setPendingProductId] = useState<string | null>(null);
  const activeRequest = useRef<PurchaseRequest | null>(null);
  const processing = useRef(new Map<string, { productId: string; promise: Promise<void> }>());
  const verified = useRef(new Set<string>());
  const completed = useRef(new Set<string>());
  const recovering = useRef(false);
  const restoring = useRef(false);
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recoverRef = useRef<() => void>(() => {});

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

  const scheduleRecovery = useCallback(() => {
    if (retryTimer.current) {
      return;
    }
    retryTimer.current = setTimeout(() => {
      retryTimer.current = null;
      recoverRef.current();
    }, RETRY_DELAY_MS);
  }, []);

  const processPurchase = useCallback(
    (purchase: Purchase, explicitSource?: 'restore' | 'owned'): Promise<void> => {
      // Purchases made while signed out are picked up by recovery after sign-in
      if (!ALL_IAP_PRODUCT_IDS.includes(purchase.productId) || !useAuthStore.getState().accessToken) {
        return Promise.resolve();
      }

      const request =
        activeRequest.current?.productId === purchase.productId ? activeRequest.current : null;
      const source: PurchaseSource = explicitSource ?? (request ? 'request' : 'background');

      // Play reports the purchase again once the payment clears
      if (purchase.purchaseState === 'pending') {
        if (source !== 'background') {
          showBottomToast('info', i18n.t('toast.purchasePending'));
        }
        if (request) {
          clearRequest(request);
        }
        return Promise.resolve();
      }

      const transactionId = getVerifyTransactionId(purchase);
      // A product ID alone cannot identify repeated purchases of a consumable.
      const purchaseKey =
        Platform.OS === 'android' ? purchase.purchaseToken || purchase.transactionId : transactionId;
      if (!purchaseKey) {
        if (source !== 'background') {
          showBottomToast('error', i18n.t('toast.purchaseFailed'));
        }
        if (request) {
          clearRequest(request);
        }
        return Promise.resolve();
      }

      const userId = useUserStore.getState().user?.id;
      const isSameUser = () => {
        const currentUserId = useUserStore.getState().user?.id;
        return userId === undefined || currentUserId === userId;
      };
      const key = `${userId}:${Platform.OS}:${purchaseKey}`;
      if (!explicitSource && completed.current.has(key)) {
        if (request) {
          clearRequest(request);
        }
        return Promise.resolve();
      }
      const pending = processing.current.get(key);
      if (pending) {
        return pending.promise;
      }

      // Register the lock before any async work, including verification and finishing.
      const promise = Promise.resolve().then(async () => {
        let outcome: VerifyOutcome | null = null;
        try {
          outcome = verified.current.has(key)
            ? { type: 'alreadyGranted' }
            : await verifyPurchase(purchase, transactionId, source === 'background');

          let finished = false;
          if (outcome.type === 'pending' || outcome.type === 'retryLater') {
            scheduleRecovery();
          } else if (outcome.type !== 'rejected') {
            // The server has settled the purchase either way, so the store can let it go
            verified.current.add(key);
            finished = await finishPurchase(purchase);
            if (finished) {
              completed.current.add(key);
            }
          }

          if (!isSameUser()) {
            return;
          }
          const userUpdated =
            outcome.type === 'granted' || outcome.type === 'alreadyGranted'
              ? await refreshUser(purchase.productId, outcome)
              : false;
          if (!isSameUser()) {
            return;
          }

          const toast = getResultToast(source, purchase.productId, outcome, {
            finished,
            userUpdated,
          });
          if (toast) {
            showBottomToast(...toast);
          }
        } finally {
          processing.current.delete(key);
          if (request) {
            clearRequest(request);
          }
          updatePendingProduct();
        }

        if (outcome?.type === 'granted') {
          // A modal callback failure must not turn a completed purchase into a failure.
          try {
            await request?.onComplete?.();
          } catch {
            // The purchase has already completed; a UI callback cannot change its result.
          }
        }
      });
      processing.current.set(key, { productId: purchase.productId, promise });
      updatePendingProduct();
      return promise;
    },
    [clearRequest, scheduleRecovery, updatePendingProduct],
  );

  const handleRequestError = useCallback(
    async (request: PurchaseRequest, error: unknown) => {
      // Native purchase-error and the request promise can report the same failure.
      if (activeRequest.current !== request || request.errorHandled) {
        return;
      }
      request.errorHandled = true;
      const code = (error as { code?: string } | null)?.code;
      try {
        if (isUserCancelledError(error)) {
          return;
        }
        // Ask to Buy: the purchase arrives through the listener once a parent approves it
        if (code === ErrorCode.DeferredPayment) {
          showBottomToast('info', i18n.t('toast.purchaseDeferred'));
          return;
        }
        // An earlier purchase of the product was never finished, so finish it before buying again
        if (code === ErrorCode.AlreadyOwned) {
          const purchases = await getAvailablePurchases();
          const owned = purchases.find((purchase) => purchase.productId === request.productId);
          if (owned) {
            await processPurchase(owned, isConsumable(owned.productId) ? 'owned' : 'restore');
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

  const recoverPurchases = useCallback(async () => {
    // A purchase in progress arrives through the listener instead
    if (
      !connected ||
      !useAuthStore.getState().accessToken ||
      recovering.current ||
      restoring.current ||
      activeRequest.current
    ) {
      return;
    }
    recovering.current = true;
    try {
      const purchases: Purchase[] =
        Platform.OS === 'ios'
          ? await getPendingTransactionsIOS()
          : (await getAvailablePurchases()).filter(
              (purchase) => isConsumable(purchase.productId) || !isAcknowledged(purchase),
            );
      for (const purchase of purchases) {
        await processPurchase(purchase);
      }
    } catch (error) {
      console.log('Failed to recover purchases:', error);
    } finally {
      recovering.current = false;
    }
  }, [connected, processPurchase]);
  recoverRef.current = recoverPurchases;

  useEffect(
    () => () => {
      if (retryTimer.current) {
        clearTimeout(retryTimer.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (!connected) {
      return;
    }
    const updates = purchaseUpdatedListener((purchase) => {
      processPurchase(purchase);
    });
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

  useEffect(() => {
    if (!accessToken) {
      // A purchase left open by signing out would block the next account's purchases
      if (activeRequest.current) {
        activeRequest.current = null;
        updatePendingProduct();
      }
      return;
    }
    if (!connected) {
      return;
    }
    recoverPurchases();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        recoverPurchases();
      }
    });
    return () => subscription.remove();
  }, [accessToken, connected, recoverPurchases, updatePendingProduct]);

  const purchaseProduct = useCallback(
    async (productId: string, onComplete?: PurchaseCompleteCallback) => {
      if (activeRequest.current || restoring.current || processing.current.size > 0) {
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
        if (!products.some((product) => product.id === productId)) {
          showBottomToast('error', i18n.t('toast.productUnavailable'));
          clearRequest(request);
          return;
        }
        await requestPurchase({
          request: { apple: { sku: productId }, google: { skus: [productId] } },
          type: 'in-app',
        });
        // Keep the request busy until the update listener finishes the transaction.
      } catch (error) {
        await handleRequestError(request, error);
      }
    },
    [clearRequest, connected, handleRequestError, loadProducts, updatePendingProduct],
  );

  const restorePurchases = useCallback(async () => {
    if (activeRequest.current || restoring.current || processing.current.size > 0) {
      return;
    }
    if (!connected) {
      showBottomToast('error', i18n.t('toast.storeNotConnected'));
      return;
    }

    restoring.current = true;
    try {
      await useUserStore.getState().updateUser();
      if (useUserStore.getState().user?.adsRemoved) {
        showBottomToast('info', i18n.t('toast.adsAlreadyRemoved'));
        return;
      }
      // Asks the App Store for purchases this device has not seen yet
      await syncStorePurchases();
      const purchases = await getAvailablePurchases();
      const removeAds = purchases.find(
        (purchase) => purchase.productId === IAP_PRODUCT_IDS.REMOVE_ADS,
      );
      if (!removeAds) {
        showBottomToast('info', i18n.t('toast.noPurchaseToRestore'));
        return;
      }
      await processPurchase(removeAds, 'restore');
    } catch (error) {
      if (!isUserCancelledError(error)) {
        showBottomToast('error', i18n.t('toast.restoreFailed'));
      }
    } finally {
      restoring.current = false;
    }
  }, [connected, processPurchase]);

  const value = useMemo(
    () => ({ pendingProductId, purchaseProduct, restorePurchases }),
    [pendingProductId, purchaseProduct, restorePurchases],
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
