import styled from 'styled-components';
import { View } from 'react-native';
import theme from '../../../styles/theme';

export const StyledBottomButtonBar = styled(View)<{ variant: 'default' | 'dim' }>`
  position: absolute;
  width: 100%;
  padding: 8px 20px;
  bottom: 0;
  background-color: ${({ variant }) =>
    variant === 'dim' ? theme.color['gray/grayBGDim'] : theme.color['gray/grayBG']};
  display: flex;
  flex-direction: row;
  gap: 12px;
`;
