import { TextInput } from 'react-native';
import styled from 'styled-components';
import theme from '../../../styles/theme';

interface StyledTextInputProps {
  isFocused: boolean;
  hasError: boolean;
  isDisabled: boolean;
}

export const StyledTextInput = styled(TextInput)<StyledTextInputProps>`
  height: 36px;
  padding: 5px 50px 5px 16px;
  border-width: 1px;
  border-radius: 18px;

  border-color: ${({ isFocused, hasError }) =>
    isFocused ? theme.color['main_color/green'] : ( hasError ? theme.color['error/error_color'] : theme.color['gray/gray100'])
  };

  background-color: ${({ isDisabled }) =>
    isDisabled ? theme.color['gray/gray100'] : theme.color['gray/white']
  };
`;
