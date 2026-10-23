import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { endConnection, getProducts, initConnection, Product } from 'react-native-iap';
import { ALL_IAP_PRODUCT_IDS } from '../constants/iap';

interface IapProductsContextValue {
  connected: boolean;
  products: Product[];
  loadProducts: () => Promise<Product[]>;
}

const IapProductsContext = createContext<IapProductsContextValue | null>(null);

// An empty or partial answer can mean the store is not ready yet, so it is not kept and is asked again later
const hasAllProducts = (products: Product[]) =>
  ALL_IAP_PRODUCT_IDS.every((productId) =>
    products.some((product) => product.productId === productId),
  );

export const IapProductsProvider = ({ children }: React.PropsWithChildren) => {
  const [connected, setConnected] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const loadedProductsRef = useRef<Product[] | null>(null);
  const pendingRequestRef = useRef<Promise<Product[]> | null>(null);

  // Only opens the connection. The purchase listener is IapPurchaseProvider's alone, because iOS hands
  // the transactions left unfinished at launch to the first listener only
  useEffect(() => {
    let active = true;
    initConnection()
      .then((result) => {
        if (active) {
          setConnected(result);
        }
      })
      .catch((error) => {
        console.log('Store connection failed:', error);
      });

    return () => {
      active = false;
      endConnection().catch(() => {});
    };
  }, []);

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
        if (hasAllProducts(nextProducts)) {
          loadedProductsRef.current = nextProducts;
        }
        setProducts(nextProducts);
        return nextProducts;
      })
      .finally(() => {
        pendingRequestRef.current = null;
      });

    return pendingRequestRef.current;
  }, [connected]);

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
