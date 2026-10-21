import React from 'react';
import renderer, { act, ReactTestRenderer } from 'react-test-renderer';
import { getProducts, Product, useIAPContext } from 'react-native-iap';
import { ALL_IAP_PRODUCT_IDS } from '../src/constants/iap';
import { IapProductsProvider, useIapProducts } from '../src/providers/IapProductsProvider';

jest.mock('react-native-iap', () => ({
  getProducts: jest.fn(),
  useIAPContext: jest.fn(),
}));

const mockGetProducts = jest.mocked(getProducts);
const mockUseIAPContext = jest.mocked(useIAPContext);
const consumers = new Map<string, ReturnType<typeof useIapProducts>>();

const Consumer = ({ name }: { name: string }) => {
  consumers.set(name, useIapProducts());
  return null;
};

const TestApp = ({ connected = true, showSettings = true }) => {
  const [products, setProducts] = React.useState<Product[]>([]);
  mockUseIAPContext.mockReturnValue({ connected, products, setProducts } as ReturnType<
    typeof useIAPContext
  >);

  return (
    <IapProductsProvider>
      <Consumer name="header" />
      {showSettings && <Consumer name="settings" />}
    </IapProductsProvider>
  );
};

const makeProducts = () => ALL_IAP_PRODUCT_IDS.map((productId) => ({ productId } as Product));

let root: ReactTestRenderer;

beforeAll(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
});

beforeEach(() => {
  jest.clearAllMocks();
  consumers.clear();
});

afterEach(async () => {
  await act(async () => root?.unmount());
});

it('shares one request and its result across consumers and screen remounts', async () => {
  let resolveProducts!: (products: Product[]) => void;
  mockGetProducts.mockReturnValueOnce(
    new Promise((resolve) => {
      resolveProducts = resolve;
    }),
  );

  await act(async () => {
    root = renderer.create(<TestApp />);
  });

  const headerRequest = consumers.get('header')!.loadProducts();
  const settingsRequest = consumers.get('settings')!.loadProducts();
  expect(headerRequest).toBe(settingsRequest);
  expect(mockGetProducts).toHaveBeenCalledTimes(1);
  expect(mockGetProducts).toHaveBeenCalledWith({ skus: ALL_IAP_PRODUCT_IDS });

  const products = makeProducts();
  await act(async () => {
    resolveProducts(products);
    await headerRequest;
  });

  expect(consumers.get('header')!.products).toEqual(products);
  expect(consumers.get('settings')!.products).toBe(consumers.get('header')!.products);

  await act(async () => root.update(<TestApp showSettings={false} />));
  await act(async () => root.update(<TestApp />));
  await expect(consumers.get('settings')!.loadProducts()).resolves.toEqual(products);
  expect(mockGetProducts).toHaveBeenCalledTimes(1);
  expect(consumers.get('header')!.connected).toBe(true);
});

it('allows a failed lookup to be retried through the shared loader', async () => {
  const error = new Error('Store unavailable');
  mockGetProducts.mockRejectedValueOnce(error).mockResolvedValueOnce(makeProducts());

  await act(async () => {
    root = renderer.create(<TestApp />);
  });
  expect(consumers.get('header')!.products).toEqual([]);

  await act(async () => {
    await consumers.get('settings')!.loadProducts();
  });

  expect(mockGetProducts).toHaveBeenCalledTimes(2);
  expect(consumers.get('header')!.products).toEqual(makeProducts());
  expect(consumers.get('settings')!.products).toEqual(makeProducts());
});

it('waits for a connection and caches even an empty successful result', async () => {
  mockGetProducts.mockResolvedValueOnce([]);
  await act(async () => {
    root = renderer.create(<TestApp connected={false} />);
  });
  expect(mockGetProducts).not.toHaveBeenCalled();

  await act(async () => root.update(<TestApp />));
  await expect(consumers.get('header')!.loadProducts()).resolves.toEqual([]);
  await expect(consumers.get('settings')!.loadProducts()).resolves.toEqual([]);
  expect(mockGetProducts).toHaveBeenCalledTimes(1);
});
