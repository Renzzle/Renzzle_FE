import { View } from 'react-native';
import styled from 'styled-components';
import theme from '../../styles/theme';

export const SignupContainer = styled(View)`
  flex: 1;
  background-color: ${theme.color['gray/grayBG']};
`;

export const LabelWrapper = styled(View)`
  padding: 22px 0 35px 28px;
`;

export const InputWithHelperWrapper = styled(View)`
  padding: 0 20px 15px;
  display: flex;
  gap: 10px;
`;

export const HelperWrapper = styled(View)`
  padding: 0 10px;
`;
