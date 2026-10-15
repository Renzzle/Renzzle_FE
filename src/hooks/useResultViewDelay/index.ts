import { useCallback, useEffect, useRef } from 'react';

// 결과 모달로 가리기 전에 끝난 판(다섯 돌 강조)을 보여주는 시간
const RESULT_VIEW_DELAY_MS = 700;

/**
 * 풀이가 끝난 판을 잠깐 보여준 뒤 결과 모달을 띄우도록 기다린다.
 * 그사이 다시 풀기 등으로 취소되면 모달을 띄우지 않도록 false로 끝난다.
 */
const useResultViewDelay = () => {
  const pendingRef = useRef<{
    timer: ReturnType<typeof setTimeout>;
    resolve: (isCompleted: boolean) => void;
  } | null>(null);

  const cancel = useCallback(() => {
    if (!pendingRef.current) {
      return;
    }
    clearTimeout(pendingRef.current.timer);
    pendingRef.current.resolve(false);
    pendingRef.current = null;
  }, []);

  const wait = useCallback(
    () =>
      new Promise<boolean>((resolve) => {
        cancel();
        const timer = setTimeout(() => {
          pendingRef.current = null;
          resolve(true);
        }, RESULT_VIEW_DELAY_MS);
        pendingRef.current = { timer, resolve };
      }),
    [cancel],
  );

  const isWaiting = useCallback(() => pendingRef.current !== null, []);

  useEffect(() => cancel, [cancel]);

  return { wait, cancel, isWaiting };
};

export default useResultViewDelay;
