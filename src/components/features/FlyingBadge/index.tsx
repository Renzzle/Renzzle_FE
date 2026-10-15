import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import { CustomText, Icon } from '../../common';
import {
  BADGE_ANCHOR_HEIGHT,
  BADGE_ANCHOR_WIDTH,
  BadgeAnchor,
  BadgeBody,
  BadgeIcon,
} from './index.styles';

export type FlyingBadgeVariant = 'success' | 'error' | 'bonus';

export interface Point {
  x: number;
  y: number;
}

interface Badge {
  variant: FlyingBadgeVariant;
  label: string;
  from: Point;
  to: Point;
  endScale: number;
  // 처음부터 띄우지 않고, 날아가기 시작할 때 출발점에서 튀어나오게 한다
  emergeOnFlight?: boolean;
}

export interface FlyingBadgeRef {
  // 출발점에 배지를 띄웠다가 목표 지점으로 날려 보내고, 도착하면 끝난다.
  // onArrive는 배지가 목표에 닿아 보이는 순간(연출을 끝내면 그때) 한 번 불린다
  play: (badge: Badge & { onArrive?: () => void }) => Promise<void>;
  // 진행 중인 연출을 바로 끝낸다
  finish: () => void;
}

const POP_MS = 180;
const HOLD_MS = 260;
const FLY_MS = 320;
// 날아가는 동안 대부분의 거리를 앞부분에 가므로, 이 시점이면 배지가 목표에 거의 닿아 있다
const ARRIVE_AT = 0.7;

const FlyingBadge = forwardRef<FlyingBadgeRef>(function FlyingBadge(_, ref) {
  const [badge, setBadge] = useState<Badge | null>(null);
  const pop = useRef(new Animated.Value(0)).current;
  const flight = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      play: ({ onArrive, ...nextBadge }) =>
        new Promise((resolve) => {
          pop.setValue(0);
          flight.setValue(0);
          setBadge(nextBadge);

          let hasArrived = false;
          const arrive = () => {
            if (!hasArrived) {
              hasArrived = true;
              onArrive?.();
            }
          };
          const arriveTimer = setTimeout(arrive, POP_MS + HOLD_MS + FLY_MS * ARRIVE_AT);

          const animation = Animated.sequence([
            Animated.timing(pop, {
              toValue: 1,
              duration: POP_MS,
              easing: Easing.out(Easing.back(2)),
              useNativeDriver: true,
            }),
            Animated.delay(HOLD_MS),
            Animated.timing(flight, {
              toValue: 1,
              duration: FLY_MS,
              easing: Easing.bezier(0.55, 0, 0.25, 1),
              useNativeDriver: true,
            }),
          ]);
          animationRef.current = animation;
          animation.start(() => {
            clearTimeout(arriveTimer);
            arrive();
            if (animationRef.current === animation) {
              animationRef.current = null;
              setBadge(null);
            }
            resolve();
          });
        }),
      finish: () => {
        animationRef.current?.stop();
      },
    }),
    [flight, pop],
  );

  if (!badge) {
    return null;
  }

  const { variant, label, from, to, endScale, emergeOnFlight } = badge;
  const scale = emergeOnFlight
    ? flight.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0.6, 1, endScale] })
    : Animated.multiply(
        pop.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }),
        flight.interpolate({ inputRange: [0, 1], outputRange: [1, endScale] }),
      );
  // 목표에 닿기 직전부터 사라져, 목표 안으로 녹아드는 것처럼 보이게 한다
  const opacity = emergeOnFlight
    ? flight.interpolate({ inputRange: [0, 0.15, 0.6, 1], outputRange: [0, 1, 1, 0] })
    : Animated.multiply(
        pop,
        flight.interpolate({ inputRange: [0, 0.6, 1], outputRange: [1, 1, 0] }),
      );

  return (
    <BadgeAnchor
      pointerEvents="none"
      style={{
        left: from.x - BADGE_ANCHOR_WIDTH / 2,
        top: from.y - BADGE_ANCHOR_HEIGHT / 2,
        opacity,
        transform: [
          { translateX: flight.interpolate({ inputRange: [0, 1], outputRange: [0, to.x - from.x] }) },
          { translateY: flight.interpolate({ inputRange: [0, 1], outputRange: [0, to.y - from.y] }) },
          { scale },
        ],
      }}>
      <BadgeBody variant={variant}>
        {variant !== 'bonus' && (
          <BadgeIcon>
            <Icon
              name={variant === 'success' ? 'CheckIcon' : 'CloseIcon'}
              size={14}
              color="gray/white"
            />
          </BadgeIcon>
        )}
        <CustomText size={variant === 'bonus' ? 12 : 14} weight="bold" color="gray/white">
          {label}
        </CustomText>
      </BadgeBody>
    </BadgeAnchor>
  );
});

export default FlyingBadge;
