import React from 'react';
import { ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import useNetworkStore from '../../../store/useNetworkStore';
import theme from '../../../styles/theme';
import CustomText from '../CustomText';
import { Box, InlineRow, Overlay } from './index.styles';

// 응답이 2초 넘게 늦어지면 화면 가운데에 띄운다. 터치는 막지 않는다
const SlowRequestIndicator = () => {
  const { t } = useTranslation();
  const isWaiting = useNetworkStore((state) => state.slowRequestCount > 0);

  if (!isWaiting) {
    return null;
  }

  return (
    <Overlay pointerEvents="none">
      <Box>
        <ActivityIndicator size="small" color={theme.color['gray/white']} />
        <CustomText size={14} lineHeight="sm" color="gray/white">
          {t('common.connecting')}
        </CustomText>
      </Box>
    </Overlay>
  );
};

// 모달은 위 안내를 가리므로, 모달 안에서는 버튼 위에 한 줄로 보여준다
export const SlowRequestNotice = () => {
  const { t } = useTranslation();
  const isWaiting = useNetworkStore((state) => state.slowRequestCount > 0);

  if (!isWaiting) {
    return null;
  }

  return (
    <InlineRow>
      <ActivityIndicator size="small" color={theme.color['gray/gray500']} />
      <CustomText size={12} lineHeight="sm" color="gray/gray500">
        {t('common.connecting')}
      </CustomText>
    </InlineRow>
  );
};

export default SlowRequestIndicator;
