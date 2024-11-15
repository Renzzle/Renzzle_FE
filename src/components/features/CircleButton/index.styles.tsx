import { TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import theme from '../../../styles/theme';

export const ButtonContainer = styled(TouchableOpacity)<{ disabled: boolean }>`
  width: 60px;
  height: 60px;
  align-items: center;
  justify-content: center;
  border-radius: 30px;
  elevation: 4;

  background-color: ${({ disabled }) =>
    disabled ? theme.color['gray/gray200'] : theme.color['sub_color/green/c']
  };
`;
