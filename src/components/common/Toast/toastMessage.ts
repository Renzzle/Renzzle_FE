import Toast, { ToastType } from 'react-native-toast-message';

export const showBottomToast = (type: ToastType, text: string) => {
  Toast.show({
    type,
    text1: text,
    position: 'bottom',
    visibilityTime: 2000,
  });
};
