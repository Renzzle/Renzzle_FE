import React, { useState } from 'react';
import { TextInputProps } from 'react-native';
import { InputContainer, RightElementWrapper, StyledTextInput } from './index.styles';
import theme from '../../../styles/theme';

interface CustomTextInputProps extends TextInputProps {
  disabled?: boolean;
  error?: boolean;
  isPassword?: boolean;
  rightElement?: React.ReactNode;
}

const CustomTextInput = ({
  disabled,
  error,
  isPassword = false,
  rightElement,
  ...props
}: CustomTextInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <InputContainer>
      <StyledTextInput
        isFocused={isFocused}
        hasError={!!error}
        isDisabled={!!disabled}
        secureTextEntry={!!isPassword}
        placeholderTextColor={theme.color['gray/gray400']}
        cursorColor={theme.color['main_color/blue_p']}
        selectionColor={theme.color['main_color/blue_p']}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        editable={!disabled}
        {...props}
      />
      {rightElement && <RightElementWrapper>{rightElement}</RightElementWrapper>}
    </InputContainer>
  );
};

export default CustomTextInput;
