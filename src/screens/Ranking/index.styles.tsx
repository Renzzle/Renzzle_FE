import { View } from 'react-native';
import styled from 'styled-components';
import theme from '../../styles/theme';
import { CustomText } from '../../components/common';

export const Container = styled(View)`
  padding: 0 15px;
  background-color: ${theme.color['gray/grayBGDim']};
  flex: 1;
  position: relative;
`;

export const ActiveTabContainer = styled(View)`
  flex: 1;
`;

export const DescText = styled(CustomText)`
  padding: 13px 15px;
`;

export const MyRankingContainer = styled(View)<{ insetsBottom: number }>`
  position: absolute;
  left: 15px;
  right: 0;
  z-index: 100;
  width: 100%;
  bottom: ${({ insetsBottom }) => `${insetsBottom + 15}px`};
`;
