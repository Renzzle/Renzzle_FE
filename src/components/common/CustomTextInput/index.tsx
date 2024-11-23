import React, { useState } from 'react';
import { TextInputProps } from 'react-native';
import { StyledTextInput } from './index.styles';

interface CustomTextInputProps extends TextInputProps {
  disabled?: boolean;
  error?: boolean;
  isPassword?: boolean;
}

const CustomTextInput = ({ disabled, error, isPassword = false, ...props }: CustomTextInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <StyledTextInput
      isFocused={isFocused}
      hasError={!!error}
      isDisabled={!!disabled}
      secureTextEntry={!!isPassword}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      editable={!disabled}
      {...props}
    />
  );
};

export default CustomTextInput;
