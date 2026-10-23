import { useCallback, useEffect, useRef } from 'react';
import { PieceProductId } from '../../constants/iap';
import { useIapProducts } from '../../providers/IapProductsProvider';
import { useIapPurchase } from '../../providers/IapPurchaseProvider';

interface UsePiecePurchaseOptions {
  onPurchaseComplete?: () => void | Promise<void>;
}

const usePiecePurchase = ({ onPurchaseComplete }: UsePiecePurchaseOptions = {}) => {
  const { connected: isStoreReady, products } = useIapProducts();
  const { pendingProductId: selectedProductId, purchaseProduct } = useIapPurchase();
  const onCompleteRef = useRef(onPurchaseComplete);
  const mountedRef = useRef(false);
  onCompleteRef.current = onPurchaseComplete;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const purchasePiece = useCallback(
    (productId: PieceProductId) =>
      purchaseProduct(productId, () => {
        if (mountedRef.current) {
          return onCompleteRef.current?.();
        }
      }),
    [purchaseProduct],
  );

  return { products, selectedProductId, isStoreReady, purchasePiece };
};

export default usePiecePurchase;
