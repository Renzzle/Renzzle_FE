import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

// 매 프레임 대신 이 간격으로만 채워 JS가 하는 일을 줄인다
const TICK_MS = 100;

interface UseCooldownOptions {
  durationMs: number;
  // 멈춘 동안에는 쿨타임도 멈춘다
  paused: boolean;
  // 바뀌면 처음부터 다시 잠근다
  resetKey: number;
}

export interface Cooldown {
  // 0에서 1로 차오르는 진행값
  progress: Animated.Value;
  isReady: boolean;
  getRemainingMs: () => number;
}

/**
 * 정해진 시간이 흘러야 풀리는 쿨타임. 멈춘 시간은 세지 않는다.
 */
const useCooldown = ({ durationMs, paused, resetKey }: UseCooldownOptions): Cooldown => {
  const progress = useRef(new Animated.Value(0)).current;
  const remainingMsRef = useRef(durationMs);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    remainingMsRef.current = durationMs;
    progress.setValue(0);
    setIsReady(false);
  }, [durationMs, progress, resetKey]);

  useEffect(() => {
    if (paused || isReady) {
      return;
    }

    let lastTickAt = Date.now();
    const timer = setInterval(() => {
      const now = Date.now();
      remainingMsRef.current = Math.max(0, remainingMsRef.current - (now - lastTickAt));
      lastTickAt = now;
      progress.setValue(1 - remainingMsRef.current / durationMs);
      if (remainingMsRef.current === 0) {
        setIsReady(true);
      }
    }, TICK_MS);

    return () => clearInterval(timer);
  }, [durationMs, isReady, paused, progress, resetKey]);

  const getRemainingMs = useCallback(() => remainingMsRef.current, []);

  return { progress, isReady, getRemainingMs };
};

export default useCooldown;
