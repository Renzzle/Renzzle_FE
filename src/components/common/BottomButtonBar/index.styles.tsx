import styled from 'styled-components';
import { View } from 'react-native';
import theme from '../../../styles/theme';

export const StyledBottomButtonBar = styled(View)`
  position: absolute;
  width: 100%;
  padding: 8px 20px;
  bottom: 0;
  background-color: ${theme.color['gray/grayBG']};
  display: flex;
  flex-direction: row;
  gap: 12px;
`;
