import React from 'react';
import { SuccessToast, ErrorToast, InfoToast, ToastProps } from 'react-native-toast-message';
import { StyleSheet } from 'react-native';
import Icon from '../Icon';

export const toastConfig = {
  success: (props: ToastProps) => (
    <SuccessToast
      {...props}
      style={toastStyle.successToast}
      contentContainerStyle={toastStyle.toastContent}
      text1Style={toastStyle.toastText1}
      renderLeadingIcon={() => <Icon name="CheckIcon" color="gray/white" size={16} />}
    />
  ),
  error: (props: ToastProps) => (
    <ErrorToast
      {...props}
      style={toastStyle.errorToast}
      contentContainerStyle={toastStyle.toastContent}
      text1Style={toastStyle.toastText1}
      renderLeadingIcon={() => <Icon name="ErrorIcon" color="gray/white" size={16} />}
    />
  ),
  info: (props: ToastProps) => (
    <InfoToast
      {...props}
      style={toastStyle.infoToast}
      contentContainerStyle={toastStyle.toastContent}
      text1Style={toastStyle.toastText1}
      renderLeadingIcon={() => <Icon name="InfoIcon" color="gray/white" size={16} />}
    />
  ),
};

const toastStyle = StyleSheet.create({
  successToast: {
    borderRadius: 7,
    height: 55,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#1A8754',
    borderLeftColor: '#1A8754',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 10,
  },
  errorToast: {
    borderRadius: 7,
    height: 55,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#E94245',
    borderLeftColor: '#E94245',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 10,
  },
  infoToast: {
    borderRadius: 7,
    height: 55,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#5bc0de',
    borderLeftColor: '#5bc0de',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 10,
  },
  toastContent: {
    paddingHorizontal: 5,
  },
  toastText1: {
    color: '#ffffff',
    fontSize: 14,
  },
});
