import { View } from 'react-native';
import styled from 'styled-components';
import theme from '../../styles/theme';

export const Container = styled(View)`
  padding: 0 15px;
  background-color: ${theme.color['gray/grayBGDim']};
  flex: 1;
  position: relative;
`;

export const UserInfoWrapper = styled(View)`
  align-items: center;
  padding: 20px 0 30px;
  gap: 4px;
`;

export const ListWrapper = styled(View)`
  gap: 10px;
`;
