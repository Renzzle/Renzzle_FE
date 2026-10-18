import { Animated, View } from 'react-native';
import styled from 'styled-components';
import theme from '../../../styles/theme';
import type { FlyingBadgeVariant } from '.';

// 시간 증감 배지는 아이콘 없이 짧은 글자만 담는 작은 배지다
export const isTimeVariant = (variant: FlyingBadgeVariant) =>
  variant === 'bonus' || variant === 'penalty';

export const BADGE_ANCHOR_WIDTH = 240;
export const BADGE_ANCHOR_HEIGHT = 48;

// 배지 크기를 재지 않고도 출발점에 가운데를 맞추도록, 넉넉한 틀의 가운데에 배지를 둔다
export const BadgeAnchor = styled(Animated.View)`
  position: absolute;
  width: ${BADGE_ANCHOR_WIDTH}px;
  height: ${BADGE_ANCHOR_HEIGHT}px;
  align-items: center;
  justify-content: center;
  z-index: 3;
`;

export const BadgeBody = styled(View)<{ variant: FlyingBadgeVariant }>`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding: ${({ variant }) => (isTimeVariant(variant) ? '4px 10px' : '7px 14px 7px 9px')};
  border-radius: 999px;
  background-color: ${({ variant }) =>
    variant === 'error' || variant === 'penalty'
      ? theme.color['main_color/yellow_s']
      : theme.color['main_color/blue_p']};
`;

export const BadgeIcon = styled(View)`
  width: 22px;
  height: 22px;
  border-radius: 11px;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.24);
`;
