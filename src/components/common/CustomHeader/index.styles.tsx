import { View } from 'react-native';
import styled from 'styled-components';

export const HeaderContainer = styled(View)<{ backgroundColor: string }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 15px 28px;
  background-color: ${({ backgroundColor }) => backgroundColor};
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
