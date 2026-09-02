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
  // 현재 남은 시간을 추적하기 위한 Ref (EventListener 내부에서 최신값 접근용)
  const remainingTimeRef = useRef<number>(TOTAL_DURATION);

  const appState = useRef<AppStateStatus>(AppState.currentState); // active, inactive, background
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null); // Store the interval ID for clearing the timer later
  const backgroundTimestamp = useRef<number | null>(null);
  const started = useRef<boolean>(false);
  const isInitialMount = useRef(true);
  const finishTriggeredRef = useRef(false);

  const progress = remainingTime / TOTAL_DURATION;

  useEffect(() => {
    remainingTimeRef.current = remainingTime;
  }, [remainingTime]);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const finishTimer = useCallback(() => {
    if (finishTriggeredRef.current) {
      return;
    }

    finishTriggeredRef.current = true;
    stopTimer();
    remainingTimeRef.current = 0;
    setRemainingTime(0);
    onFinish?.();
  }, [onFinish, stopTimer]);

  const startTimer = useCallback(() => {
    if (intervalRef.current || finishTriggeredRef.current) {
      return;
    }

    intervalRef.current = setInterval(() => {
      const next = remainingTimeRef.current - 1000;

      if (next <= 0) {
        finishTimer();
        return;
      }

      remainingTimeRef.current = next;
      setRemainingTime(next);
    }, 1000);
  }, [finishTimer]);

  // Add bonus time
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (bonusTimeTrigger !== undefined) {
      const next = Math.min(remainingTimeRef.current + BONUS_TIME, TOTAL_DURATION);
      remainingTimeRef.current = next;
      setRemainingTime(next);
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

      // Active -> Background
      if (previousState.match(/active/) && nextAppState.match(/inactive|background/)) {
        stopTimer();
        backgroundTimestamp.current = Date.now();
      }

      // Background -> Active
      if (previousState.match(/inactive|background/) && nextAppState === 'active') {
        if (backgroundTimestamp.current) {
          const elapsed = Date.now() - backgroundTimestamp.current;
          const currentRemaining = remainingTimeRef.current; // Ref에서 최신 시간 가져옴
          const newRemaining = Math.max(currentRemaining - elapsed, 0);

          remainingTimeRef.current = newRemaining;
          setRemainingTime(newRemaining);
          backgroundTimestamp.current = null;

          if (newRemaining <= 0) {
            finishTimer();
          } else {
            startTimer();
          }
        } else {
          startTimer();
        }
      }

      appState.current = nextAppState;
    },
    [paused, startTimer, stopTimer, finishTimer],
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
      finishTriggeredRef.current = false;
      remainingTimeRef.current = TOTAL_DURATION;
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
