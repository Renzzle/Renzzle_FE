import Toast, { ToastType } from 'react-native-toast-message';

// 화면 하단에서 토스트가 떠 있는 높이 (라이브러리 기본값 40)
const BOTTOM_TOAST_OFFSET = 60;

export const showBottomToast = (type: ToastType, text: string) => {
  Toast.show({
    type,
    text1: text,
    position: 'bottom',
    visibilityTime: 2000,
    bottomOffset: BOTTOM_TOAST_OFFSET,
  });
};
