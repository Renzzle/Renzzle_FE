import { View } from 'react-native';
import styled from 'styled-components';
import theme from '../../../styles/theme';

export const HeaderContainer = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 15px 28px;
  /* TODO: 화면에 따라 다른 색상으로 업데이트 필요 */
  background-color: ${theme.color['gray/grayBGDim']};
`;

export const MenuWrapper = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

export const CurrencyWrapper = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;
