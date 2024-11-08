import { TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import theme from '../../../styles/theme';

export const StyledButton = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 17px 0 16px 0;
  border-radius: 6px;
  border-width: 0;
  flex: 1;
`;

export const StyledPrimaryButton = styled(StyledButton)<{ disabled: boolean }>`
  background-color: ${({ disabled }) =>
    disabled ? theme.color['gray/gray100'] : theme.color['sub_color/green/bg']
  };
`;

export const StyledSecondaryButton = styled(StyledButton)<{ disabled: boolean }>`
  background-color: ${({ disabled }) =>
    disabled ? theme.color['gray/gray100'] : theme.color['sub_color/green/s']
  };
`;
