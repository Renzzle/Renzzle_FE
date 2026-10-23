import React from 'react';
import renderer, { act, ReactTestRenderer } from 'react-test-renderer';
import { endConnection, fetchProducts, initConnection, Product } from 'react-native-iap';
import { ALL_IAP_PRODUCT_IDS } from '../src/constants/iap';
import { IapProductsProvider, useIapProducts } from '../src/providers/IapProductsProvider';

jest.mock('react-native-iap', () => ({
  endConnection: jest.fn(),
  fetchProducts: jest.fn(),
  initConnection: jest.fn(),
}));

const mockFetchProducts = jest.mocked(fetchProducts);
const mockInitConnection = jest.mocked(initConnection);
const mockEndConnection = jest.mocked(endConnection);
const consumers = new Map<string, ReturnType<typeof useIapProducts>>();

const Consumer = ({ name }: { name: string }) => {
  consumers.set(name, useIapProducts());
  return null;
};

const TestApp = ({ showSettings = true }) => (
  <IapProductsProvider>
    <Consumer name="header" />
    {showSettings && <Consumer name="settings" />}
  </IapProductsProvider>
);

const load = async (name: string) => {
  let products: Product[] = [];
  await act(async () => {
    products = await consumers.get(name)!.loadProducts();
  });
  return products;
};

const makeProducts = () => ALL_IAP_PRODUCT_IDS.map((id) => ({ id } as Product));

let root: ReactTestRenderer;

beforeAll(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
});

beforeEach(() => {
  jest.resetAllMocks();
  consumers.clear();
  mockInitConnection.mockResolvedValue(true);
  mockEndConnection.mockResolvedValue(true);
});

afterEach(async () => {
  await act(async () => root?.unmount());
});

it('shares one request and its result across consumers and screen remounts', async () => {
  let resolveProducts!: (products: Product[]) => void;
  mockFetchProducts.mockReturnValueOnce(
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
  expect(mockFetchProducts).toHaveBeenCalledTimes(1);
  expect(mockFetchProducts).toHaveBeenCalledWith({ skus: ALL_IAP_PRODUCT_IDS, type: 'in-app' });

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
  expect(mockFetchProducts).toHaveBeenCalledTimes(1);
  expect(consumers.get('header')!.connected).toBe(true);
});

it('allows a failed lookup to be retried through the shared loader', async () => {
  const error = new Error('Store unavailable');
  mockFetchProducts.mockRejectedValueOnce(error).mockResolvedValueOnce(makeProducts());

  await act(async () => {
    root = renderer.create(<TestApp />);
  });
  expect(consumers.get('header')!.products).toEqual([]);

  await act(async () => {
    await consumers.get('settings')!.loadProducts();
  });

  expect(mockFetchProducts).toHaveBeenCalledTimes(2);
  expect(consumers.get('header')!.products).toEqual(makeProducts());
  expect(consumers.get('settings')!.products).toEqual(makeProducts());
});

it('waits for the connection and asks again after an empty or partial result', async () => {
  let connect!: (connected: boolean) => void;
  mockInitConnection.mockReturnValueOnce(
    new Promise((resolve) => {
      connect = resolve;
    }),
  );
  const partial = makeProducts().slice(1);
  mockFetchProducts
    .mockResolvedValueOnce([])
    .mockResolvedValueOnce(partial)
    .mockResolvedValue(makeProducts());

  await act(async () => {
    root = renderer.create(<TestApp />);
  });
  expect(consumers.get('header')!.connected).toBe(false);
  await expect(consumers.get('header')!.loadProducts()).rejects.toThrow();
  expect(mockFetchProducts).not.toHaveBeenCalled();

  await act(async () => {
    connect(true);
  });
  expect(mockFetchProducts).toHaveBeenCalledTimes(1);
  expect(consumers.get('header')!.products).toEqual([]);

  await expect(load('header')).resolves.toEqual(partial);
  await expect(load('settings')).resolves.toEqual(makeProducts());
  await expect(load('settings')).resolves.toEqual(makeProducts());
  expect(mockFetchProducts).toHaveBeenCalledTimes(3);
});

it('opens the store connection once and closes it on unmount', async () => {
  mockFetchProducts.mockResolvedValue(makeProducts());
  await act(async () => {
    root = renderer.create(<TestApp />);
  });
  await act(async () => root.update(<TestApp showSettings={false} />));
  expect(mockInitConnection).toHaveBeenCalledTimes(1);
  expect(mockEndConnection).not.toHaveBeenCalled();

  await act(async () => root.unmount());
  expect(mockEndConnection).toHaveBeenCalledTimes(1);
});

it('stays disconnected without looking up products when the connection fails', async () => {
  mockInitConnection.mockRejectedValueOnce(new Error('Billing unavailable'));
  await act(async () => {
    root = renderer.create(<TestApp />);
  });
  expect(consumers.get('header')!.connected).toBe(false);
  expect(mockFetchProducts).not.toHaveBeenCalled();
});
