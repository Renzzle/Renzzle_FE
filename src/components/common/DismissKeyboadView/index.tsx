/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { TouchableWithoutFeedback, Keyboard, View } from 'react-native';
import { KeyboardAwareScrollViewProps } from 'react-native-keyboard-aware-scroll-view';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const DismissKeyboardView: React.FC<KeyboardAwareScrollViewProps> = ({ children, ...props }) => (
  <KeyboardAwareScrollView
    {...props}
    style={props.style}
    enableOnAndroid={true}
    enableAutomaticScroll={true}
    extraScrollHeight={0}
    extraHeight={100}
    keyboardShouldPersistTaps="handled">
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1, minHeight: '100%' }}>{children}</View>
    </TouchableWithoutFeedback>
  </KeyboardAwareScrollView>
);

export default DismissKeyboardView;
