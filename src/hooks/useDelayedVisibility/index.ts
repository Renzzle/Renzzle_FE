import { useEffect, useRef, useState } from 'react';

interface UseDelayedVisibilityOptions {
  showDelayMs?: number;
  minVisibleMs?: number;
}

/**
 * A custom React hook that manages the visibility of a component with a delay and minimum visible duration.
 */
const useDelayedVisibility = (
  active: boolean,
  { showDelayMs = 300, minVisibleMs = 500 }: UseDelayedVisibilityOptions = {},
): boolean => {
  const [visible, setVisible] = useState(false);
  const visibleRef = useRef(false);
  const shownAtRef = useRef(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (active) {
      if (!visibleRef.current) {
        timer = setTimeout(() => {
          visibleRef.current = true;
          shownAtRef.current = Date.now();
          setVisible(true);
        }, showDelayMs);
      }
    } else if (visibleRef.current) {
      const remainingMs = minVisibleMs - (Date.now() - shownAtRef.current);
      if (remainingMs <= 0) {
        visibleRef.current = false;
        setVisible(false);
      } else {
        timer = setTimeout(() => {
          visibleRef.current = false;
          setVisible(false);
        }, remainingMs);
      }
    }

    return () => {
      if (timer !== undefined) {
        clearTimeout(timer);
      }
    };
  }, [active, showDelayMs, minVisibleMs]);

  return visible;
};

export default useDelayedVisibility;
