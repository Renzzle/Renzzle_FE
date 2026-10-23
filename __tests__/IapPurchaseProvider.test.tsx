import React from 'react';
import renderer, { act, ReactTestRenderer } from 'react-test-renderer';
import { AppState, AppStateStatus, NativeEventSubscription, Platform } from 'react-native';
import {
  ErrorCode,
  finishTransaction,
  getAvailablePurchases,
  IapIos,
  isUserCancelledError,
  Purchase,
  purchaseErrorListener,
  PurchaseStateAndroid,
  purchaseUpdatedListener,
  requestPurchase,
} from 'react-native-iap';
import { verifyInAppPurchase } from '../src/apis/payment';
import { ApiError } from '../src/apis/apiError';
import { showBottomToast } from '../src/components/common/Toast/toastMessage';
import { ALL_IAP_PRODUCT_IDS, IAP_PRODUCT_IDS } from '../src/constants/iap';
import usePiecePurchase from '../src/hooks/usePiecePurchase';
import { useIapProducts } from '../src/providers/IapProductsProvider';
import { IapPurchaseProvider, useIapPurchase } from '../src/providers/IapPurchaseProvider';
import { User, useUserStore } from '../src/store/useUserStore';

jest.mock('react-native-iap', () => ({
  ErrorCode: {
    E_USER_CANCELLED: 'E_USER_CANCELLED',
    E_ALREADY_OWNED: 'E_ALREADY_OWNED',
    E_DEFERRED_PAYMENT: 'E_DEFERRED_PAYMENT',
  },
  PurchaseStateAndroid: { UNSPECIFIED_STATE: 0, PURCHASED: 1, PENDING: 2 },
  IapIos: { getPendingPurchasesIOS: jest.fn() },
  finishTransaction: jest.fn(),
  getAvailablePurchases: jest.fn(),
  isUserCancelledError: jest.fn(),
  purchaseErrorListener: jest.fn(),
  purchaseUpdatedListener: jest.fn(),
  requestPurchase: jest.fn(),
}));
jest.mock('../src/apis/payment', () => ({ verifyInAppPurchase: jest.fn() }));
jest.mock('../src/components/common/Toast/toastMessage', () => ({ showBottomToast: jest.fn() }));
jest.mock('../src/providers/IapProductsProvider', () => ({ useIapProducts: jest.fn() }));
jest.mock('../src/locales/i18n', () => ({ t: (key: string) => key }));
jest.mock('../src/store/useUserStore', () => ({ useUserStore: { getState: jest.fn() } }));
jest.mock('../src/store/useAuthStore', () => {
  const getState = () => ({ accessToken: mockAuth.accessToken });
  const useAuthStore = (selector: (state: ReturnType<typeof getState>) => unknown) =>
    selector(getState());
  useAuthStore.getState = getState;
  return { __esModule: true, default: useAuthStore };
});

const mockAuth: { accessToken?: string } = {};
const consumers = new Map<string, ReturnType<typeof usePiecePurchase>>();
let controller: ReturnType<typeof useIapPurchase>;
const mockUpdateUser = jest.fn();
const mockSetUser = jest.fn();
const mockLoadProducts = jest.fn();
const removeUpdates = jest.fn();
const removeErrors = jest.fn();
const removeAppState = jest.fn();
let appStateHandler: ((state: AppStateStatus) => void) | undefined;
let userState: {
  user: User | null;
  setUser: jest.Mock;
  clearUser: jest.Mock;
  updateUser: jest.Mock;
};
let root: ReactTestRenderer;

const Header = ({ name, onComplete }: { name: string; onComplete?: () => void }) => {
  consumers.set(name, usePiecePurchase({ onPurchaseComplete: onComplete }));
  return null;
};
const Controller = () => {
  controller = useIapPurchase();
  return null;
};
const TestApp = ({
  onComplete,
  showHome = true,
  showSecondHeader = true,
}: {
  onComplete?: () => void;
  showHome?: boolean;
  showSecondHeader?: boolean;
}) => (
  <IapPurchaseProvider>
    <Controller />
    {showHome && <Header name="home" onComplete={onComplete} />}
    {showSecondHeader && <Header name="settings" />}
  </IapPurchaseProvider>
);

const deferred = <T,>() => {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};
const purchase = (transactionId = 'transaction-1', productId = IAP_PRODUCT_IDS.PIECE_1000) =>
  ({
    productId,
    transactionId,
    transactionReceipt: 'receipt',
  } as Purchase);
const androidPurchase = (
  purchaseToken: string,
  productId = IAP_PRODUCT_IDS.PIECE_1000,
  extra: Partial<Purchase> = {},
) =>
  ({
    ...purchase(`order-${purchaseToken}`, productId),
    purchaseToken,
    purchaseStateAndroid: PurchaseStateAndroid.PURCHASED,
    isAcknowledgedAndroid: false,
    ...extra,
  } as Purchase);
const emit = (event: Purchase) => {
  jest.mocked(purchaseUpdatedListener).mock.calls[0][0](event);
};
const emitError = (error: { code: string; productId?: string }) => {
  jest
    .mocked(purchaseErrorListener)
    .mock.calls[0][0](error as Parameters<Parameters<typeof purchaseErrorListener>[0]>[0]);
};
const mount = async (onComplete?: () => void) => {
  await act(async () => {
    root = renderer.create(<TestApp onComplete={onComplete} />);
  });
};
const request = async (productId: string = IAP_PRODUCT_IDS.PIECE_1000) => {
  await act(async () => {
    await controller.purchaseProduct(productId);
  });
};
const toastCount = (type: string) =>
  jest.mocked(showBottomToast).mock.calls.filter(([toastType]) => toastType === type).length;
const successCount = () => toastCount('success');
const failureCount = () => toastCount('error');
const makeUser = (overrides: Partial<User> = {}): User => ({
  id: 1,
  email: 'player@renzzle.com',
  nickname: 'player',
  currency: 500,
  adsRemoved: false,
  ...overrides,
});

beforeAll(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
});
beforeEach(() => {
  jest.resetAllMocks();
  consumers.clear();
  mockAuth.accessToken = 'access-token';
  appStateHandler = undefined;
  userState = {
    user: null,
    setUser: mockSetUser,
    clearUser: jest.fn(),
    updateUser: mockUpdateUser,
  };
  jest
    .mocked(purchaseUpdatedListener)
    .mockReturnValue({ remove: removeUpdates } as unknown as ReturnType<
      typeof purchaseUpdatedListener
    >);
  jest
    .mocked(purchaseErrorListener)
    .mockReturnValue({ remove: removeErrors } as unknown as ReturnType<
      typeof purchaseErrorListener
    >);
  jest
    .mocked(isUserCancelledError)
    .mockImplementation((error) => (error as { code?: string })?.code === 'E_USER_CANCELLED');
  jest.spyOn(AppState, 'addEventListener').mockImplementation((_type, handler) => {
    appStateHandler = handler as (state: AppStateStatus) => void;
    return { remove: removeAppState } as unknown as NativeEventSubscription;
  });
  mockLoadProducts.mockResolvedValue(ALL_IAP_PRODUCT_IDS.map((productId) => ({ productId })));
  jest
    .mocked(useIapProducts)
    .mockReturnValue({ connected: true, products: [], loadProducts: mockLoadProducts });
  jest.mocked(useUserStore.getState).mockImplementation(() => userState);
  mockUpdateUser.mockResolvedValue(true);
  jest.mocked(verifyInAppPurchase).mockResolvedValue({
    platform: 'IOS',
    productId: IAP_PRODUCT_IDS.PIECE_1000,
    grantedCurrency: 1000,
  });
  jest.mocked(finishTransaction).mockResolvedValue(true);
  jest.mocked(requestPurchase).mockResolvedValue(undefined);
  jest.mocked(getAvailablePurchases).mockResolvedValue([]);
  jest.mocked(IapIos.getPendingPurchasesIOS).mockResolvedValue([]);
});
afterEach(async () => {
  await act(async () => root?.unmount());
  jest.restoreAllMocks();
  jest.useRealTimers();
});

it('uses one listener across headers and rerenders and calls only the latest requesting callback', async () => {
  const initialCallback = jest.fn();
  const latestCallback = jest.fn();
  await mount(initialCallback);
  await act(async () => {
    await consumers.get('home')!.purchasePiece(IAP_PRODUCT_IDS.PIECE_1000);
  });
  await act(async () => {
    root.update(<TestApp onComplete={latestCallback} showSecondHeader={false} />);
  });
  await act(async () => {
    root.update(<TestApp onComplete={latestCallback} />);
  });
  expect(purchaseUpdatedListener).toHaveBeenCalledTimes(1);
  expect(purchaseErrorListener).toHaveBeenCalledTimes(1);
  await act(async () => {
    emit(purchase());
  });
  expect(initialCallback).not.toHaveBeenCalled();
  expect(latestCallback).toHaveBeenCalledTimes(1);
  expect(showBottomToast).toHaveBeenCalledWith('success', 'toast.purchaseComplete');
  expect(successCount()).toBe(1);
});

it('blocks duplicate verification and finishing while busy and ignores completed replays', async () => {
  const verification = deferred<Awaited<ReturnType<typeof verifyInAppPurchase>>>();
  const finishing = deferred<boolean>();
  jest.mocked(verifyInAppPurchase).mockReturnValueOnce(verification.promise);
  jest.mocked(finishTransaction).mockReturnValueOnce(finishing.promise);
  await mount();
  await act(async () => {
    await consumers.get('home')!.purchasePiece(IAP_PRODUCT_IDS.PIECE_1000);
  });
  await act(async () => {
    for (let i = 0; i < 20; i++) {
      emit(purchase());
    }
  });
  expect(verifyInAppPurchase).toHaveBeenCalledTimes(1);
  expect(finishTransaction).not.toHaveBeenCalled();
  expect(consumers.get('settings')!.selectedProductId).toBe(IAP_PRODUCT_IDS.PIECE_1000);
  await act(async () => {
    verification.resolve({
      platform: 'IOS',
      productId: IAP_PRODUCT_IDS.PIECE_1000,
      grantedCurrency: 1000,
    });
  });
  await act(async () => {
    emit(purchase());
  });
  expect(finishTransaction).toHaveBeenCalledTimes(1);
  expect(consumers.get('home')!.selectedProductId).toBe(IAP_PRODUCT_IDS.PIECE_1000);
  await act(async () => {
    finishing.resolve(true);
  });
  await act(async () => {
    emit(purchase());
  });
  expect(verifyInAppPurchase).toHaveBeenCalledTimes(1);
  expect(finishTransaction).toHaveBeenCalledTimes(1);
  expect(mockUpdateUser).toHaveBeenCalledTimes(1);
  expect(successCount()).toBe(1);
  expect(failureCount()).toBe(0);
  expect(controller.pendingProductId).toBeNull();
});

it('guards rapid taps across different headers before the disabled state renders', async () => {
  await mount();
  await act(async () => {
    await Promise.all([
      consumers.get('home')!.purchasePiece(IAP_PRODUCT_IDS.PIECE_1000),
      consumers.get('settings')!.purchasePiece(IAP_PRODUCT_IDS.PIECE_5000),
    ]);
  });
  expect(mockLoadProducts).toHaveBeenCalledTimes(1);
  expect(requestPurchase).toHaveBeenCalledTimes(1);
  expect(requestPurchase).toHaveBeenCalledWith({ sku: IAP_PRODUCT_IDS.PIECE_1000 });
});

it('handles separate consumable transactions independently', async () => {
  await mount();
  await act(async () => {
    emit(purchase('first'));
    emit(purchase('second'));
  });
  expect(verifyInAppPurchase).toHaveBeenCalledTimes(2);
  expect(finishTransaction).toHaveBeenCalledTimes(2);
  expect(mockUpdateUser).toHaveBeenCalledTimes(2);
  expect(showBottomToast).toHaveBeenCalledWith('success', 'toast.previousPurchaseApplied');
});

it('reports a granted consumable even if finishing fails and finishes it later without re-verifying', async () => {
  jest.mocked(finishTransaction).mockRejectedValueOnce(new Error('Store temporarily unavailable'));
  await mount();
  await request();
  await act(async () => {
    emit(purchase());
  });
  expect(showBottomToast).toHaveBeenCalledWith('success', 'toast.purchaseComplete');
  await act(async () => {
    emit(purchase());
  });
  await act(async () => {
    emit(purchase());
  });
  expect(verifyInAppPurchase).toHaveBeenCalledTimes(1);
  expect(finishTransaction).toHaveBeenCalledTimes(2);
  expect(successCount()).toBe(1);
  expect(failureCount()).toBe(0);
});

it('keeps a purchase open when the server cannot be reached and processes it again later', async () => {
  jest.mocked(verifyInAppPurchase).mockRejectedValueOnce(new Error('Network Error'));
  await mount();
  await request();
  await act(async () => {
    for (let i = 0; i < 10; i++) {
      emit(purchase());
    }
  });
  expect(verifyInAppPurchase).toHaveBeenCalledTimes(1);
  expect(finishTransaction).not.toHaveBeenCalled();
  expect(mockUpdateUser).not.toHaveBeenCalled();
  expect(showBottomToast).toHaveBeenCalledTimes(1);
  expect(showBottomToast).toHaveBeenCalledWith('info', 'toast.purchaseRetryLater');
  expect(controller.pendingProductId).toBeNull();
  await act(async () => {
    emit(purchase());
  });
  expect(verifyInAppPurchase).toHaveBeenCalledTimes(2);
  expect(finishTransaction).toHaveBeenCalledTimes(1);
  expect(showBottomToast).toHaveBeenLastCalledWith('success', 'toast.previousPurchaseApplied');
});

it('retries a delayed purchase from the store queue after a minute', async () => {
  jest.useFakeTimers();
  const event = purchase();
  jest
    .mocked(verifyInAppPurchase)
    .mockRejectedValueOnce(new ApiError('Store API failed', 'I5030', 503));
  jest
    .mocked(IapIos.getPendingPurchasesIOS)
    .mockResolvedValueOnce([])
    .mockResolvedValueOnce([event]);
  await mount();
  await request();
  await act(async () => {
    emit(event);
  });
  expect(finishTransaction).not.toHaveBeenCalled();
  await act(async () => {
    jest.advanceTimersByTime(60 * 1000);
  });
  expect(IapIos.getPendingPurchasesIOS).toHaveBeenCalledTimes(2);
  expect(verifyInAppPurchase).toHaveBeenCalledTimes(2);
  expect(verifyInAppPurchase).toHaveBeenLastCalledWith(event, {
    transactionId: 'transaction-1',
    background: true,
  });
  expect(finishTransaction).toHaveBeenCalledTimes(1);
  expect(showBottomToast).toHaveBeenLastCalledWith('success', 'toast.previousPurchaseApplied');
});

it('waits for the next launch or foreground before retrying a refused purchase', async () => {
  jest.useFakeTimers();
  jest
    .mocked(verifyInAppPurchase)
    .mockRejectedValueOnce(new ApiError('Receipt does not match', 'I4003', 400));
  await mount();
  await request();
  await act(async () => {
    emit(purchase());
  });
  expect(showBottomToast).toHaveBeenCalledWith('error', 'Receipt does not match');
  await act(async () => {
    jest.advanceTimersByTime(60 * 1000);
  });
  expect(IapIos.getPendingPurchasesIOS).toHaveBeenCalledTimes(1);
  expect(finishTransaction).not.toHaveBeenCalled();
});

it('verifies a re-downloaded iOS ad removal by its original transaction', async () => {
  userState.user = makeUser();
  const redownload = {
    ...purchase('new-transaction', IAP_PRODUCT_IDS.REMOVE_ADS),
    originalTransactionIdentifierIOS: 'original-transaction',
  } as Purchase;
  jest
    .mocked(verifyInAppPurchase)
    .mockRejectedValueOnce(new ApiError('Already processed', 'I4090', 409));
  await mount();
  await request(IAP_PRODUCT_IDS.REMOVE_ADS);
  await act(async () => {
    emit(redownload);
  });
  expect(verifyInAppPurchase).toHaveBeenCalledWith(redownload, {
    transactionId: 'original-transaction',
    background: false,
  });
  expect(finishTransaction).toHaveBeenCalledWith({ purchase: redownload, isConsumable: false });
  expect(showBottomToast).toHaveBeenCalledWith('info', 'toast.removeAdsOtherAccount');
});

it('refreshes server user information once after an ad removal purchase without consuming it', async () => {
  await mount();
  await request(IAP_PRODUCT_IDS.REMOVE_ADS);
  const event = purchase('remove-ads', IAP_PRODUCT_IDS.REMOVE_ADS);
  await act(async () => {
    emit(event);
    emit(event);
  });
  expect(finishTransaction).toHaveBeenCalledWith({ purchase: event, isConsumable: false });
  expect(mockUpdateUser).toHaveBeenCalledTimes(1);
});

it('shows the granted currency when reloading the user fails', async () => {
  userState.user = makeUser({ currency: 500 });
  mockUpdateUser.mockResolvedValue(false);
  await mount();
  await request();
  await act(async () => {
    emit(purchase());
  });
  expect(mockSetUser).toHaveBeenCalledWith(makeUser({ currency: 1500 }));
  expect(showBottomToast).toHaveBeenCalledWith('success', 'toast.purchaseComplete');
});

it('deduplicates native errors and request promise rejections', async () => {
  const pendingRequest = deferred<void>();
  jest.mocked(requestPurchase).mockReturnValueOnce(pendingRequest.promise);
  await mount();
  let requesting!: Promise<void>;
  await act(async () => {
    requesting = controller.purchaseProduct(IAP_PRODUCT_IDS.PIECE_1000);
  });
  await act(async () => {
    emitError({ code: 'E_NETWORK_ERROR' });
    pendingRequest.reject(new Error('Store unavailable'));
    await requesting;
  });
  expect(failureCount()).toBe(1);
  expect(controller.pendingProductId).toBeNull();
});

it('ignores cancellation and permits the next purchase request', async () => {
  await mount();
  await request();
  await act(async () => {
    emitError({ code: ErrorCode.E_USER_CANCELLED });
  });
  expect(showBottomToast).not.toHaveBeenCalled();
  expect(controller.pendingProductId).toBeNull();
  await request(IAP_PRODUCT_IDS.PIECE_5000);
  expect(requestPurchase).toHaveBeenCalledTimes(2);
});

it('tells the user when a purchase is waiting for Ask to Buy approval', async () => {
  await mount();
  await request();
  await act(async () => {
    emitError({ code: ErrorCode.E_DEFERRED_PAYMENT });
  });
  expect(showBottomToast).toHaveBeenCalledTimes(1);
  expect(showBottomToast).toHaveBeenCalledWith('info', 'toast.purchaseDeferred');
  expect(controller.pendingProductId).toBeNull();
});

it('restores an owned remove-ads purchase through the same transaction processor', async () => {
  const event = purchase('owned-remove-ads', IAP_PRODUCT_IDS.REMOVE_ADS);
  jest.mocked(getAvailablePurchases).mockResolvedValueOnce([event]);
  await mount();
  await request(IAP_PRODUCT_IDS.REMOVE_ADS);
  await act(async () => {
    emitError({ code: ErrorCode.E_ALREADY_OWNED });
  });
  expect(verifyInAppPurchase).toHaveBeenCalledTimes(1);
  expect(mockUpdateUser).toHaveBeenCalledTimes(1);
  expect(showBottomToast).toHaveBeenCalledWith('success', 'toast.removeAdsRestored');
  expect(controller.pendingProductId).toBeNull();
});

it('tells the user when this store account already removed ads for another Renzzle account', async () => {
  userState.user = makeUser();
  jest
    .mocked(verifyInAppPurchase)
    .mockRejectedValueOnce(new ApiError('Already processed', 'I4090', 409));
  await mount();
  await request(IAP_PRODUCT_IDS.REMOVE_ADS);
  await act(async () => {
    emit(purchase('remove-ads', IAP_PRODUCT_IDS.REMOVE_ADS));
  });
  expect(finishTransaction).toHaveBeenCalledTimes(1);
  expect(showBottomToast).toHaveBeenCalledTimes(1);
  expect(showBottomToast).toHaveBeenCalledWith('info', 'toast.removeAdsOtherAccount');
});

it('uses Android purchase tokens for replay protection and the Android request shape', async () => {
  jest.replaceProperty(Platform, 'OS', 'android');
  await mount();
  await request();
  expect(requestPurchase).toHaveBeenCalledWith({ skus: [IAP_PRODUCT_IDS.PIECE_1000] });
  await act(async () => {
    emit(androidPurchase('token-1'));
    emit(androidPurchase('token-1'));
    emit(androidPurchase('token-2'));
  });
  expect(verifyInAppPurchase).toHaveBeenCalledTimes(2);
});

it('waits for an Android payment that is still pending', async () => {
  jest.replaceProperty(Platform, 'OS', 'android');
  await mount();
  await request();
  await act(async () => {
    emit(androidPurchase('token-1', IAP_PRODUCT_IDS.PIECE_1000, {
      purchaseStateAndroid: PurchaseStateAndroid.PENDING,
    }));
  });
  expect(verifyInAppPurchase).not.toHaveBeenCalled();
  expect(finishTransaction).not.toHaveBeenCalled();
  expect(showBottomToast).toHaveBeenCalledWith('info', 'toast.purchasePending');
  expect(controller.pendingProductId).toBeNull();
});

it('consumes an earlier pack that was already granted when Play says it is still owned', async () => {
  jest.replaceProperty(Platform, 'OS', 'android');
  const owned = androidPurchase('old-token', IAP_PRODUCT_IDS.PIECE_1000, {
    isAcknowledgedAndroid: true,
  });
  jest.mocked(getAvailablePurchases).mockResolvedValueOnce([]).mockResolvedValueOnce([owned]);
  jest
    .mocked(verifyInAppPurchase)
    .mockRejectedValueOnce(new ApiError('Already processed', 'I4090', 409));
  await mount();
  await request();
  await act(async () => {
    emitError({ code: ErrorCode.E_ALREADY_OWNED });
  });
  expect(finishTransaction).toHaveBeenCalledWith({ purchase: owned, isConsumable: true });
  expect(showBottomToast).toHaveBeenCalledTimes(1);
  expect(showBottomToast).toHaveBeenCalledWith('info', 'toast.retryPurchase');
  expect(controller.pendingProductId).toBeNull();
});

it('does not acknowledge an Android ad removal the server already acknowledged', async () => {
  jest.replaceProperty(Platform, 'OS', 'android');
  const owned = androidPurchase('remove-ads', IAP_PRODUCT_IDS.REMOVE_ADS, {
    isAcknowledgedAndroid: true,
  });
  jest.mocked(getAvailablePurchases).mockResolvedValueOnce([]).mockResolvedValueOnce([owned]);
  await mount();
  await request(IAP_PRODUCT_IDS.REMOVE_ADS);
  await act(async () => {
    emitError({ code: ErrorCode.E_ALREADY_OWNED });
  });
  expect(verifyInAppPurchase).toHaveBeenCalledTimes(1);
  expect(finishTransaction).not.toHaveBeenCalled();
  expect(showBottomToast).toHaveBeenCalledWith('success', 'toast.removeAdsRestored');
});

it('recovers unconsumed packs and unacknowledged ad removal on Android', async () => {
  jest.replaceProperty(Platform, 'OS', 'android');
  const pack = androidPurchase('pack', IAP_PRODUCT_IDS.PIECE_1000, { isAcknowledgedAndroid: true });
  const removeAds = androidPurchase('remove-ads', IAP_PRODUCT_IDS.REMOVE_ADS);
  const settledRemoveAds = androidPurchase('settled', IAP_PRODUCT_IDS.REMOVE_ADS, {
    isAcknowledgedAndroid: true,
  });
  jest.mocked(getAvailablePurchases).mockResolvedValueOnce([pack, removeAds, settledRemoveAds]);
  await mount();
  expect(verifyInAppPurchase).toHaveBeenCalledTimes(2);
  expect(verifyInAppPurchase).toHaveBeenCalledWith(pack, {
    transactionId: undefined,
    background: true,
  });
  expect(verifyInAppPurchase).toHaveBeenCalledWith(removeAds, {
    transactionId: undefined,
    background: true,
  });
  expect(finishTransaction).toHaveBeenCalledWith({ purchase: pack, isConsumable: true });
  expect(finishTransaction).toHaveBeenCalledWith({ purchase: removeAds, isConsumable: false });
});

it('leaves purchases alone while signed out and recovers them after sign-in', async () => {
  mockAuth.accessToken = undefined;
  const event = purchase();
  jest.mocked(IapIos.getPendingPurchasesIOS).mockResolvedValue([event]);
  await mount();
  await act(async () => {
    emit(event);
  });
  expect(IapIos.getPendingPurchasesIOS).not.toHaveBeenCalled();
  expect(verifyInAppPurchase).not.toHaveBeenCalled();

  mockAuth.accessToken = 'access-token';
  await act(async () => {
    root.update(<TestApp />);
  });
  expect(verifyInAppPurchase).toHaveBeenCalledTimes(1);
  expect(finishTransaction).toHaveBeenCalledTimes(1);
  expect(showBottomToast).toHaveBeenCalledWith('success', 'toast.previousPurchaseApplied');
});

it('leaves an unfinished iOS ad removal to the launch replay or a restore', async () => {
  jest
    .mocked(IapIos.getPendingPurchasesIOS)
    .mockResolvedValueOnce([
      purchase('pack'),
      purchase('remove-ads', IAP_PRODUCT_IDS.REMOVE_ADS),
    ]);
  await mount();
  expect(verifyInAppPurchase).toHaveBeenCalledTimes(1);
  expect(verifyInAppPurchase).toHaveBeenCalledWith(purchase('pack'), {
    transactionId: 'pack',
    background: true,
  });
});

it('checks the store queue again when the app returns to the foreground', async () => {
  await mount();
  expect(IapIos.getPendingPurchasesIOS).toHaveBeenCalledTimes(1);
  await act(async () => {
    appStateHandler?.('background');
    appStateHandler?.('active');
  });
  expect(IapIos.getPendingPurchasesIOS).toHaveBeenCalledTimes(2);
});

it('releases a purchase request left open by signing out', async () => {
  await mount();
  await request();
  expect(controller.pendingProductId).toBe(IAP_PRODUCT_IDS.PIECE_1000);
  mockAuth.accessToken = undefined;
  await act(async () => {
    root.update(<TestApp />);
  });
  expect(controller.pendingProductId).toBeNull();
});

it('does not call the store when restoring and ads are already removed', async () => {
  mockUpdateUser.mockImplementation(async () => {
    userState.user = makeUser({ adsRemoved: true });
    return true;
  });
  await mount();
  await act(async () => {
    await controller.restorePurchases();
  });
  expect(getAvailablePurchases).not.toHaveBeenCalled();
  expect(showBottomToast).toHaveBeenCalledWith('info', 'toast.adsAlreadyRemoved');
});

it('tells the user when there is no ad removal purchase to restore', async () => {
  await mount();
  await act(async () => {
    await controller.restorePurchases();
  });
  expect(verifyInAppPurchase).not.toHaveBeenCalled();
  expect(showBottomToast).toHaveBeenCalledWith('info', 'toast.noPurchaseToRestore');
});

it('restores ad removal on iOS with the original transaction ID', async () => {
  const restored = {
    ...purchase('restored-transaction', IAP_PRODUCT_IDS.REMOVE_ADS),
    originalTransactionIdentifierIOS: 'original-transaction',
  } as Purchase;
  jest.mocked(getAvailablePurchases).mockResolvedValueOnce([restored]);
  await mount();
  await act(async () => {
    await controller.restorePurchases();
  });
  expect(verifyInAppPurchase).toHaveBeenCalledWith(restored, {
    transactionId: 'original-transaction',
    background: false,
  });
  expect(showBottomToast).toHaveBeenCalledWith('success', 'toast.removeAdsRestored');
});

it('does not finish the purchase when the store has not cleared the payment', async () => {
  jest
    .mocked(verifyInAppPurchase)
    .mockRejectedValueOnce(new ApiError('Payment pending', 'I4091', 409));
  await mount();
  await request();
  await act(async () => {
    emit(purchase());
  });
  expect(finishTransaction).not.toHaveBeenCalled();
  expect(showBottomToast).toHaveBeenCalledWith('info', 'toast.purchasePending');
});

it.each([
  ['I4090', 409, 'Receipt already processed', 'info', 'toast.purchaseAlreadyApplied', true],
  ['I4002', 400, 'Store verification failed', 'error', 'Store verification failed', true],
  ['S409', 409, 'Database constraint violated', 'error', 'Database constraint violated', false],
  ['I5030', 503, 'Store API failed', 'info', 'toast.purchaseRetryLater', false],
  ['G500', 500, 'Internal server error', 'info', 'toast.purchaseRetryLater', false],
])(
  'handles %s by showing one message and finishing only settled purchases',
  async (code, status, message, toastType, toastText, finishes) => {
    jest.mocked(verifyInAppPurchase).mockRejectedValueOnce(new ApiError(message, code, status));
    await mount();
    await request();
    await act(async () => {
      emit(purchase());
    });
    expect(showBottomToast).toHaveBeenCalledTimes(1);
    expect(showBottomToast).toHaveBeenCalledWith(toastType, toastText);
    expect(finishTransaction).toHaveBeenCalledTimes(finishes ? 1 : 0);
    expect(successCount()).toBe(0);
    expect(controller.pendingProductId).toBeNull();
  },
);

it('settles replayed purchases quietly unless they newly grant something', async () => {
  jest
    .mocked(verifyInAppPurchase)
    .mockRejectedValueOnce(new ApiError('Receipt already processed', 'I4090', 409))
    .mockRejectedValueOnce(new ApiError('Store API failed', 'I5030', 503));
  await mount();
  await act(async () => {
    emit(purchase('settled'));
  });
  await act(async () => {
    emit(purchase('delayed'));
  });
  expect(finishTransaction).toHaveBeenCalledTimes(1);
  expect(showBottomToast).not.toHaveBeenCalled();
});

it('does not reclassify a completed purchase when its UI callback throws', async () => {
  await mount(() => {
    throw new Error('Modal unmounted');
  });
  await act(async () => {
    await consumers.get('home')!.purchasePiece(IAP_PRODUCT_IDS.PIECE_1000);
  });
  await act(async () => {
    emit(purchase());
    emit(purchase());
  });
  expect(successCount()).toBe(1);
  expect(failureCount()).toBe(0);
  expect(verifyInAppPurchase).toHaveBeenCalledTimes(1);
});

it('finishes a purchase after its requesting header unmounts without calling the stale UI', async () => {
  const onComplete = jest.fn();
  await mount(onComplete);
  await act(async () => {
    await consumers.get('home')!.purchasePiece(IAP_PRODUCT_IDS.PIECE_1000);
  });
  await act(async () => {
    root.update(<TestApp showHome={false} />);
  });
  await act(async () => {
    emit(purchase());
  });
  expect(finishTransaction).toHaveBeenCalledTimes(1);
  expect(mockUpdateUser).toHaveBeenCalledTimes(1);
  expect(onComplete).not.toHaveBeenCalled();
  expect(successCount()).toBe(1);
  expect(purchaseUpdatedListener).toHaveBeenCalledTimes(1);
});

it('removes the store and app state listeners when the provider unmounts', async () => {
  await mount();
  await act(async () => {
    root.unmount();
  });
  expect(removeUpdates).toHaveBeenCalledTimes(1);
  expect(removeErrors).toHaveBeenCalledTimes(1);
  expect(removeAppState).toHaveBeenCalledTimes(1);
});
