import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { Container, TimerText, TimeTextWrapper } from './index.styles';
import * as Progress from 'react-native-progress';
import { CustomText, Icon } from '../../common';
import theme from '../../../styles/theme';

const TOTAL_DURATION = 3 * 60 * 1000; // 3 min
const BONUS_TIME = 10 * 1000; // 10 sec

interface TimerWithProgressBarProps {
  start: boolean;
  paused: boolean;
  onFinish: () => void;
  bonusTimeTrigger?: number;
}

const TimerWithProgressBar = ({
  start,
  paused,
  onFinish,
  bonusTimeTrigger,
}: TimerWithProgressBarProps) => {
  const [remainingTime, setRemainingTime] = useState<number>(TOTAL_DURATION);
  const appState = useRef<AppStateStatus>(AppState.currentState); // active, inactive, background
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null); // Store the interval ID for clearing the timer later
  const backgroundTimestamp = useRef<number | null>(null);
  const started = useRef<boolean>(false);
  const isInitialMount = useRef(true);

  const progress = remainingTime / TOTAL_DURATION;

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    if (intervalRef.current) {
      return;
    }

    intervalRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        const next = prev - 1000;
        if (next <= 0) {
          stopTimer();
          onFinish?.();
          return 0;
        }
        return next;
      });
    }, 1000);
  }, [onFinish, stopTimer]);

  // Add bonus time
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (bonusTimeTrigger !== undefined) {
      setRemainingTime((prev) => prev + BONUS_TIME);
    }
  }, [bonusTimeTrigger]);

  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      if (!started.current || paused) {
        appState.current = nextAppState;
        return;
      }

      const previousState = appState.current;

      console.log(nextAppState);

      if (previousState.match(/active/) && nextAppState.match(/inactive|background/)) {
        stopTimer();
        backgroundTimestamp.current = Date.now();
      }
      if (previousState.match(/inactive|background/) && nextAppState === 'active') {
        if (backgroundTimestamp.current) {
          const elapsed = Date.now() - backgroundTimestamp.current;
          setRemainingTime((prev) => Math.max(prev - elapsed, 0));
          backgroundTimestamp.current = null;
        }
        startTimer();
      }

      appState.current = nextAppState;
    },
    [appState, paused, startTimer, stopTimer],
  );

  // Listen for app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
      stopTimer();
    };
  }, [handleAppStateChange, stopTimer]);

  // Timer initial start
  useEffect(() => {
    if (start && !started.current) {
      setRemainingTime(TOTAL_DURATION);
      started.current = true;
      if (!paused) {
        startTimer();
      }
    } else if (!start && started.current) {
      stopTimer();
      started.current = false;
    }
  }, [start, paused, startTimer, stopTimer]);

  // Timer pause, resume
  useEffect(() => {
    if (!started.current) {
      return;
    }

    if (paused) {
      stopTimer();
    } else {
      startTimer();
    }
  }, [paused, startTimer, stopTimer]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const formattedSeconds = String(seconds).padStart(2, '0');
    return `${minutes}:${formattedSeconds}`;
  };

  return (
    <Container>
      <Progress.Bar
        progress={progress}
        width={null}
        height={12}
        borderRadius={6}
        animated
        useNativeDriver
        color={theme.color['main_color/blue_p']}
        unfilledColor={theme.color['gray/gray100']}
        borderWidth={0}
      />
      <TimeTextWrapper>
        <Icon name="TimerIcon" size={18} color="main_color/blue_p" />
        <TimerText>
          <CustomText size={14} weight="bold" color="main_color/blue_p" lineHeight="sm">
            {formatTime(remainingTime)}
          </CustomText>
        </TimerText>
      </TimeTextWrapper>
    </Container>
  );
};

export default TimerWithProgressBar;
