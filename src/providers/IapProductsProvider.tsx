import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { getProducts, Product, useIAPContext } from 'react-native-iap';
import { ALL_IAP_PRODUCT_IDS } from '../constants/iap';

interface IapProductsContextValue {
  connected: boolean;
  products: Product[];
  loadProducts: () => Promise<Product[]>;
}

const IapProductsContext = createContext<IapProductsContextValue | null>(null);

export const IapProductsProvider = ({ children }: React.PropsWithChildren) => {
  const { connected, products, setProducts } = useIAPContext();
  const loadedProductsRef = useRef<Product[] | null>(null);
  const pendingRequestRef = useRef<Promise<Product[]> | null>(null);

  const loadProducts = useCallback((): Promise<Product[]> => {
    // Every consumer waits for the same native request to avoid cancelling another lookup.
    if (pendingRequestRef.current) {
      return pendingRequestRef.current;
    }

    if (!connected) {
      return Promise.reject(new Error('스토어가 연결되지 않았습니다.'));
    }

    if (loadedProductsRef.current !== null) {
      return Promise.resolve(loadedProductsRef.current);
    }

    pendingRequestRef.current = getProducts({ skus: ALL_IAP_PRODUCT_IDS })
      .then((nextProducts) => {
        loadedProductsRef.current = nextProducts;
        setProducts(nextProducts);
        return nextProducts;
      })
      .finally(() => {
        pendingRequestRef.current = null;
      });

    return pendingRequestRef.current;
  }, [connected, setProducts]);

  useEffect(() => {
    if (connected) {
      // A failed preload is retried by the shared loader when a purchase is requested.
      loadProducts().catch(() => {});
    }
  }, [connected, loadProducts]);

  const value = useMemo(
    () => ({ connected, products, loadProducts }),
    [connected, products, loadProducts],
  );

  return <IapProductsContext.Provider value={value}>{children}</IapProductsContext.Provider>;
};

export const useIapProducts = () => {
  const context = useContext(IapProductsContext);

  if (!context) {
    throw new Error('useIapProducts must be used within IapProductsProvider');
  }

  return context;
};
