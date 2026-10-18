import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { ActionButtonWrapper, ICON_SIZE, IconArea, RING_SIZE, RingSlot } from './index.styles';
import { CustomText, Icon } from '../../common';
import { IconName } from '../../../assets/icons';
import { useTranslation } from 'react-i18next';
import theme from '../../../styles/theme';
import { Cooldown } from '../../../hooks/useCooldown';

type PuzzleActionMode = 'showAnswer' | 'retry' | 'giveUp' | 'skip' | 'endGame';

const RING_STROKE = 3;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
// 원이 12시 방향부터 차오르게 한다
const RING_ROTATION = { transform: [{ rotate: '-90deg' }] };

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface PuzzleActionButtonProps {
  mode: PuzzleActionMode;
  disabled?: boolean;
  onPress: () => void;
  // 쿨타임 동안은 아이콘 둘레 원이 차오르고, 누르면 흔들리기만 한다.
  // 원이 글자 자리까지 걸치므로 글자는 원이 사라질 때 나타난다
  cooldown?: Cooldown;
}

const PuzzleActionButton = ({
  mode,
  disabled = false,
  onPress,
  cooldown,
}: PuzzleActionButtonProps) => {
  const { t } = useTranslation();
  const ringOpacity = useRef(new Animated.Value(1)).current;
  const readyPop = useRef(new Animated.Value(0)).current;
  const shake = useRef(new Animated.Value(0)).current;
  const isCoolingDown = !!cooldown && !cooldown.isReady;
  const wasCoolingDownRef = useRef(isCoolingDown);

  useEffect(() => {
    if (isCoolingDown) {
      ringOpacity.setValue(1);
      readyPop.setValue(0);
    } else if (wasCoolingDownRef.current) {
      // 풀리는 순간 원을 지우고 아이콘을 톡 키운다
      Animated.parallel([
        Animated.timing(ringOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(readyPop, {
          toValue: 1,
          duration: 320,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    }
    wasCoolingDownRef.current = isCoolingDown;
  }, [isCoolingDown, readyPop, ringOpacity]);

  const handlePress = () => {
    if (!isCoolingDown) {
      onPress();
      return;
    }
    shake.setValue(0);
    Animated.timing(shake, {
      toValue: 1,
      duration: 320,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  const modeLabel: Record<PuzzleActionMode, string> = {
    showAnswer: t('puzzle.viewAnswer'),
    retry: t('puzzle.retry'),
    giveUp: t('puzzle.resign'),
    skip: t('puzzle.skip'),
    endGame: t('puzzle.endGame'),
  };

  const modeIcon: Record<PuzzleActionMode, IconName> = {
    showAnswer: 'LightbulbAlertIcon',
    retry: 'RefreshIcon',
    giveUp: 'FlagIcon',
    skip: 'ChevronDoubleRightIcon',
    endGame: 'FlagIcon',
  };

  const color = disabled || isCoolingDown ? 'gray/gray200' : 'gray/gray500';

  return (
    <ActionButtonWrapper onPress={handlePress} disabled={!!disabled}>
      <Animated.View
        style={{
          transform: [
            {
              translateX: shake.interpolate({
                inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
                outputRange: [0, -4, 4, -3, 2, 0],
              }),
            },
          ],
        }}>
        <IconArea>
          {cooldown && (
            <RingSlot pointerEvents="none" style={{ opacity: ringOpacity }}>
              <Svg width={RING_SIZE} height={RING_SIZE} style={RING_ROTATION}>
                <Circle
                  cx={RING_SIZE / 2}
                  cy={RING_SIZE / 2}
                  r={RING_RADIUS}
                  stroke={theme.color['gray/gray100']}
                  strokeWidth={RING_STROKE}
                  fill="none"
                />
                <AnimatedCircle
                  cx={RING_SIZE / 2}
                  cy={RING_SIZE / 2}
                  r={RING_RADIUS}
                  stroke={theme.color['main_color/blue_p']}
                  strokeWidth={RING_STROKE}
                  strokeLinecap="round"
                  strokeDasharray={RING_CIRCUMFERENCE}
                  strokeDashoffset={cooldown.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [RING_CIRCUMFERENCE, 0],
                  })}
                  fill="none"
                />
              </Svg>
            </RingSlot>
          )}
          <Animated.View
            style={{
              transform: [
                {
                  scale: readyPop.interpolate({
                    inputRange: [0, 0.4, 1],
                    outputRange: [1, 1.22, 1],
                  }),
                },
              ],
            }}>
            <Icon name={modeIcon[mode]} color={color} size={ICON_SIZE} />
          </Animated.View>
        </IconArea>
      </Animated.View>
      <Animated.View
        style={
          cooldown && {
            opacity: ringOpacity.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
          }
        }>
        <CustomText size={8} lineHeight="sm" color={color}>
          {modeLabel[mode]}
        </CustomText>
      </Animated.View>
    </ActionButtonWrapper>
  );
};

export default PuzzleActionButton;
