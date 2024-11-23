import React, { useState } from 'react';
import { TextInputProps } from 'react-native';
import { StyledTextInput } from './index.styles';
import theme from '../../../styles/theme';

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
      placeholderTextColor={theme.color['gray/gray400']}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      editable={!disabled}
      {...props}
    />
  );
};

export default CustomTextInput;
