import { TextInput } from 'react-native';
import styled from 'styled-components';
import theme from '../../../styles/theme';

interface StyledTextInputProps {
  isFocused: boolean;
  hasError: boolean;
  isDisabled: boolean;
}

export const StyledTextInput = styled(TextInput)<StyledTextInputProps>`
  padding: 5px 50px 5px 16px;
  color: ${theme.color['gray/gray900']};
  border-width: 1px;
  border-radius: 13px;

  font-family: 'NanumSquareNeoOTF-Bd';
  font-size: 14px;

  border-color: ${({ isFocused, hasError }) =>
    isFocused
      ? theme.color['main_color/blue_p']
      : hasError
      ? theme.color['error/error_color']
      : theme.color['gray/gray150']};

  background-color: ${({ isDisabled }) =>
    isDisabled ? theme.color['gray/gray100'] : theme.color['gray/white']};
`;
