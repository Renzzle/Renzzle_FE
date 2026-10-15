import { useCallback, useEffect, useRef } from 'react';

interface UseCancellableNativeRequestParams {
  cancelRequest?: (requestId: number) => void;
}

// 네이티브 모듈은 취소된 요청 ID를 앱 전체에서 기억한다. 화면(보드)마다 ID를 1부터 다시 세면
// 이전 화면에서 취소만 되고 남은 ID와 겹쳐 새 요청이 곧바로 취소 처리되므로, ID는 앱 전체에서 증가시킨다
let lastRequestId = 0;

const useCancellableNativeRequest = ({ cancelRequest }: UseCancellableNativeRequestParams) => {
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

    lastRequestId += 1;
    activeRequestIdRef.current = lastRequestId;

    return lastRequestId;
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
