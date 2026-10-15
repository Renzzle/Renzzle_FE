import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import { Container } from './index.styles';
import { RankingResultTheme, ResultVariant } from '../../../types';
import { CustomText, Icon } from '../../common';

interface Props {
  variant: ResultVariant;
  count: number;
}

export interface RankingCounterRef {
  // 결과 배지가 도착할 때 톡 커졌다 돌아온다
  bump: () => void;
  measureInWindow: View['measureInWindow'];
}

const RankingCounter = forwardRef<RankingCounterRef, Props>(function RankingCounter(
  { variant, count },
  ref,
) {
  const selectedVariant = RankingResultTheme[variant];
  const viewRef = useRef<View>(null);
  const bumpProgress = useRef(new Animated.Value(0)).current;
  const scale = bumpProgress.interpolate({ inputRange: [0, 0.35, 1], outputRange: [1, 1.25, 1] });

  useImperativeHandle(
    ref,
    () => ({
      // 커지고 돌아오는 것을 한 애니메이션으로 해야, 다음 판을 그리느라 JS가 바쁠 때도 중간에 멈추지 않는다
      bump: () => {
        bumpProgress.setValue(0);
        Animated.timing(bumpProgress, {
          toValue: 1,
          duration: 280,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }).start();
      },
      measureInWindow: (callback) => viewRef.current?.measureInWindow(callback),
    }),
    [bumpProgress],
  );

  return (
    <Animated.View ref={viewRef} style={{ transform: [{ scale }] }}>
      <Container variant={variant}>
        <Icon name={selectedVariant.iconName} size={24} color={selectedVariant.primary} />
        <CustomText size={14} weight="bold" lineHeight="sm" color={selectedVariant.primary}>
          {count}
        </CustomText>
      </Container>
    </Animated.View>
  );
});

export default RankingCounter;
