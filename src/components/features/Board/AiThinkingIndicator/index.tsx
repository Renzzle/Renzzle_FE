import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CustomText } from '../../../common';
import { ChipContainer, Dot, DotsContainer, IndicatorSlot } from './index.styles';

const FADE_DURATION_MS = 150;
const DEEP_THINKING_DELAY_MS = 3000;
const DOT_COUNT = 3;

interface AiThinkingIndicatorProps {
  visible: boolean;
}

const AiThinkingIndicator = ({ visible }: AiThinkingIndicatorProps) => {
  const { t } = useTranslation();

  const [isDeepThinking, setIsDeepThinking] = useState(false);
  const [shouldRender, setShouldRender] = useState(visible);
  const chipOpacity = useRef(new Animated.Value(0)).current;
  const dotOpacities = useRef(
    Array.from({ length: DOT_COUNT }, () => new Animated.Value(0.3)),
  ).current;

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
    }

    Animated.timing(chipOpacity, {
      toValue: visible ? 1 : 0,
      duration: FADE_DURATION_MS,
      useNativeDriver: true,
    }).start(({ finished }) => {
      // reset deep thinking state when the indicator is hidden
      if (!visible && finished) {
        setIsDeepThinking(false);
        setShouldRender(false);
      }
    });

    if (!visible) {
      return;
    }

    const deepThinkingTimer = setTimeout(() => {
      setIsDeepThinking(true);
    }, DEEP_THINKING_DELAY_MS);

    const dotAnimation = Animated.loop(
      Animated.stagger(
        160,
        dotOpacities.map((opacity) =>
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 1,
              duration: 240,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.3,
              duration: 240,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
        ),
      ),
    );
    dotAnimation.start();

    return () => {
      clearTimeout(deepThinkingTimer);
      dotAnimation.stop();
    };
  }, [chipOpacity, dotOpacities, visible]);

  if (!shouldRender) {
    return null;
  }

  return (
    <IndicatorSlot pointerEvents="none">
      <Animated.View style={{ opacity: chipOpacity }}>
        <ChipContainer>
          <CustomText size={12} color="gray/white">
            {t(isDeepThinking ? 'puzzle.aiThinkingDeep' : 'puzzle.aiThinking')}
          </CustomText>
          <DotsContainer>
            {dotOpacities.map((opacity, index) => (
              <Dot key={index} style={{ opacity }} />
            ))}
          </DotsContainer>
        </ChipContainer>
      </Animated.View>
    </IndicatorSlot>
  );
};

export default AiThinkingIndicator;
