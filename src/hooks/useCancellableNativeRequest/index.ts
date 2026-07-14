import { useCallback, useEffect, useRef } from 'react';

interface UseCancellableNativeRequestParams {
  cancelRequest?: (requestId: number) => void;
}

const useCancellableNativeRequest = ({ cancelRequest }: UseCancellableNativeRequestParams) => {
  const requestIdRef = useRef(0);
  const activeRequestIdRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearScheduledRequest = useCallback(() => {
    if (timeoutRef.current === null) {
      return;
    }

    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }, []);

  const cancelActiveRequest = useCallback(() => {
    clearScheduledRequest();

    const activeRequestId = activeRequestIdRef.current;
    if (activeRequestId === null) {
      return;
    }

    activeRequestIdRef.current = null;
    cancelRequest?.(activeRequestId);
  }, [cancelRequest, clearScheduledRequest]);

  const startRequest = useCallback(() => {
    cancelActiveRequest();

    requestIdRef.current += 1;
    activeRequestIdRef.current = requestIdRef.current;

    return requestIdRef.current;
  }, [cancelActiveRequest]);

  const scheduleRequest = useCallback(
    (callback: (requestId: number) => void | Promise<void>) => {
      const requestId = startRequest();

      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        if (activeRequestIdRef.current !== requestId) {
          return;
        }

        callback(requestId);
      }, 0);

      return requestId;
    },
    [startRequest],
  );

  const isActiveRequest = useCallback((requestId: number) => {
    return activeRequestIdRef.current === requestId;
  }, []);

  const finishRequest = useCallback((requestId: number) => {
    if (activeRequestIdRef.current === requestId) {
      activeRequestIdRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      cancelActiveRequest();
    };
  }, [cancelActiveRequest]);

  return {
    cancelActiveRequest,
    finishRequest,
    isActiveRequest,
    scheduleRequest,
    startRequest,
  };
};

export default useCancellableNativeRequest;
