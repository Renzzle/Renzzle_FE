import React from 'react';
import renderer, { act, ReactTestRenderer } from 'react-test-renderer';
import { Platform } from 'react-native';
import {
  ErrorCode,
  finishTransaction,
  getAvailablePurchases,
  Purchase,
  purchaseErrorListener,
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
import { useUserStore } from '../src/store/useUserStore';

jest.mock('react-native-iap', () => ({
  ErrorCode: { E_USER_CANCELLED: 'E_USER_CANCELLED', E_ALREADY_OWNED: 'E_ALREADY_OWNED' },
  finishTransaction: jest.fn(),
  getAvailablePurchases: jest.fn(),
  isUserCancelledError: jest.fn(() => false),
  purchaseErrorListener: jest.fn(),
  purchaseUpdatedListener: jest.fn(),
  requestPurchase: jest.fn(),
}));
jest.mock('../src/apis/payment', () => ({ verifyInAppPurchase: jest.fn() }));
jest.mock('../src/components/common/Toast/toastMessage', () => ({ showBottomToast: jest.fn() }));
jest.mock('../src/providers/IapProductsProvider', () => ({ useIapProducts: jest.fn() }));
jest.mock('../src/locales/i18n', () => ({ t: (key: string) => key }));
jest.mock('../src/store/useUserStore', () => ({ useUserStore: { getState: jest.fn() } }));

const consumers = new Map<string, ReturnType<typeof usePiecePurchase>>();
let controller: ReturnType<typeof useIapPurchase>;
const mockUpdateUser = jest.fn();
const mockLoadProducts = jest.fn();
const removeUpdates = jest.fn();
const removeErrors = jest.fn();
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
const successCount = () =>
  jest.mocked(showBottomToast).mock.calls.filter(([type]) => type === 'success').length;
const failureCount = () =>
  jest.mocked(showBottomToast).mock.calls.filter(([type]) => type === 'error').length;

beforeAll(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
});
beforeEach(() => {
  jest.resetAllMocks();
  consumers.clear();
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
  mockLoadProducts.mockResolvedValue(ALL_IAP_PRODUCT_IDS.map((productId) => ({ productId })));
  jest
    .mocked(useIapProducts)
    .mockReturnValue({ connected: true, products: [], loadProducts: mockLoadProducts });
  jest.mocked(useUserStore.getState).mockReturnValue({
    user: null,
    setUser: jest.fn(),
    clearUser: jest.fn(),
    updateUser: mockUpdateUser,
  });
  jest.mocked(verifyInAppPurchase).mockResolvedValue({
    platform: 'IOS',
    productId: IAP_PRODUCT_IDS.PIECE_1000,
    grantedCurrency: 1000,
  });
  jest.mocked(finishTransaction).mockResolvedValue(true);
  jest.mocked(requestPurchase).mockResolvedValue(undefined);
});
afterEach(async () => {
  await act(async () => root?.unmount());
  jest.restoreAllMocks();
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
});

it('retries finishing without re-verifying an already granted purchase', async () => {
  jest.mocked(finishTransaction).mockRejectedValueOnce(new Error('Store temporarily unavailable'));
  await mount();
  await act(async () => {
    emit(purchase());
  });
  expect(successCount()).toBe(0);
  await act(async () => {
    emit(purchase());
  });
  expect(verifyInAppPurchase).toHaveBeenCalledTimes(1);
  expect(finishTransaction).toHaveBeenCalledTimes(2);
  expect(successCount()).toBe(1);
});

it('does not finish or grant an unverified purchase and allows retry after a real verification failure', async () => {
  jest.mocked(verifyInAppPurchase).mockRejectedValueOnce(new Error('Receipt already processed'));
  await mount();
  await act(async () => {
    for (let i = 0; i < 10; i++) {
      emit(purchase());
    }
  });
  expect(verifyInAppPurchase).toHaveBeenCalledTimes(1);
  expect(finishTransaction).not.toHaveBeenCalled();
  expect(mockUpdateUser).not.toHaveBeenCalled();
  expect(failureCount()).toBe(1);
  expect(controller.pendingProductId).toBeNull();
  await act(async () => {
    emit(purchase());
  });
  expect(verifyInAppPurchase).toHaveBeenCalledTimes(2);
  expect(successCount()).toBe(1);
});

it('refreshes server user information once after an ad removal purchase without consuming it', async () => {
  await mount();
  await act(async () => {
    await controller.purchaseProduct(IAP_PRODUCT_IDS.REMOVE_ADS);
  });
  const event = purchase('remove-ads', IAP_PRODUCT_IDS.REMOVE_ADS);
  await act(async () => {
    emit(event);
    emit(event);
  });
  expect(finishTransaction).toHaveBeenCalledWith({ purchase: event, isConsumable: false });
  expect(mockUpdateUser).toHaveBeenCalledTimes(1);
});

it('deduplicates native errors and request promise rejections', async () => {
  const request = deferred<void>();
  jest.mocked(requestPurchase).mockReturnValueOnce(request.promise);
  await mount();
  let requesting!: Promise<void>;
  await act(async () => {
    requesting = controller.purchaseProduct(IAP_PRODUCT_IDS.PIECE_1000);
  });
  await act(async () => {
    emitError({ code: 'E_NETWORK_ERROR' });
    request.reject(new Error('Store unavailable'));
    await requesting;
  });
  expect(failureCount()).toBe(1);
  expect(controller.pendingProductId).toBeNull();
});

it('ignores cancellation and permits the next purchase request', async () => {
  await mount();
  await act(async () => {
    await controller.purchaseProduct(IAP_PRODUCT_IDS.PIECE_1000);
  });
  await act(async () => {
    emitError({ code: ErrorCode.E_USER_CANCELLED });
  });
  expect(failureCount()).toBe(0);
  expect(controller.pendingProductId).toBeNull();
  await act(async () => {
    await controller.purchaseProduct(IAP_PRODUCT_IDS.PIECE_5000);
  });
  expect(requestPurchase).toHaveBeenCalledTimes(2);
});

it('restores an owned remove-ads purchase through the same transaction processor', async () => {
  const event = purchase('owned-remove-ads', IAP_PRODUCT_IDS.REMOVE_ADS);
  jest.mocked(getAvailablePurchases).mockResolvedValueOnce([event]);
  await mount();
  await act(async () => {
    await controller.purchaseProduct(IAP_PRODUCT_IDS.REMOVE_ADS);
  });
  await act(async () => {
    emitError({ code: ErrorCode.E_ALREADY_OWNED });
  });
  expect(verifyInAppPurchase).toHaveBeenCalledTimes(1);
  expect(mockUpdateUser).toHaveBeenCalledTimes(1);
  expect(showBottomToast).toHaveBeenCalledWith('success', 'toast.removeAdsRestored');
  expect(controller.pendingProductId).toBeNull();
});

it('uses Android purchase tokens for replay protection and the Android request shape', async () => {
  jest.replaceProperty(Platform, 'OS', 'android');
  await mount();
  await act(async () => {
    await controller.purchaseProduct(IAP_PRODUCT_IDS.PIECE_1000);
  });
  expect(requestPurchase).toHaveBeenCalledWith({ skus: [IAP_PRODUCT_IDS.PIECE_1000] });
  await act(async () => {
    emit({ ...purchase(''), purchaseToken: 'token-1' });
    emit({ ...purchase(''), purchaseToken: 'token-1' });
    emit({ ...purchase(''), purchaseToken: 'token-2' });
  });
  expect(verifyInAppPurchase).toHaveBeenCalledTimes(2);
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

it('removes both store listeners when the provider unmounts', async () => {
  await mount();
  await act(async () => {
    root.unmount();
  });
  expect(removeUpdates).toHaveBeenCalledTimes(1);
  expect(removeErrors).toHaveBeenCalledTimes(1);
});

it.each([
  ['I4002', 400, 'Store verification failed'],
  ['I4090', 409, 'Receipt already processed'],
  ['S409', 409, 'Database constraint violated'],
  ['G500', 500, 'Internal server error'],
])(
  'shows one user-facing error for %s without finishing or granting the purchase',
  async (code, status, message) => {
    jest.mocked(verifyInAppPurchase).mockRejectedValueOnce(new ApiError(message, code, status));
    await mount();
    await act(async () => {
      emit(purchase());
    });
    expect(showBottomToast).toHaveBeenCalledTimes(1);
    expect(showBottomToast).toHaveBeenCalledWith('error', message);
    expect(finishTransaction).not.toHaveBeenCalled();
    expect(mockUpdateUser).not.toHaveBeenCalled();
    expect(successCount()).toBe(0);
  },
);
