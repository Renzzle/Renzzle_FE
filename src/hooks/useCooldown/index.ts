import { useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';

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
}

/**
 * 정해진 시간이 흘러야 풀리는 쿨타임. 멈춘 시간은 세지 않는다.
 */
const useCooldown = ({ durationMs, paused, resetKey }: UseCooldownOptions): Cooldown => {
  const progress = useRef(new Animated.Value(0)).current;
  const remainingMsRef = useRef(durationMs);
  const [isReady, setIsReady] = useState(false);

  // 멈췄다 다시 이어갈 때 남은 시간만큼만 채우도록 기억해 둔다
  useEffect(() => {
    const listenerId = progress.addListener(({ value }) => {
      remainingMsRef.current = (1 - value) * durationMs;
    });
    return () => progress.removeListener(listenerId);
  }, [durationMs, progress]);

  useEffect(() => {
    progress.setValue(0);
    setIsReady(false);
  }, [progress, resetKey]);

  useEffect(() => {
    if (paused || isReady) {
      return;
    }

    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: remainingMsRef.current,
      easing: Easing.linear,
      // SVG 원처럼 네이티브로 움직일 수 없는 속성에도 쓸 수 있게 한다
      useNativeDriver: false,
    });
    animation.start(({ finished }) => {
      if (finished) {
        setIsReady(true);
      }
    });

    return () => animation.stop();
  }, [isReady, paused, progress, resetKey]);

  return { progress, isReady };
};

export default useCooldown;
