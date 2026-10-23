import Toast, { ToastType } from 'react-native-toast-message';

// 화면 하단에서 토스트가 떠 있는 높이 (라이브러리 기본값 40)
const BOTTOM_TOAST_OFFSET = 60;

export const showBottomToast = (type: ToastType, text: string, visibilityTime = 2000) => {
  // 응답 없음 에러는 문자열이 아닌 에러 객체로 오고, 네트워크 오류 모달이 대신 안내한다
  if (typeof text !== 'string' || !text) {
    return;
  }
  Toast.show({
    type,
    text1: text,
    position: 'bottom',
    visibilityTime,
    bottomOffset: BOTTOM_TOAST_OFFSET,
  });
};
