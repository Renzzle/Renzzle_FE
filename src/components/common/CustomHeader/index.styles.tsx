import { TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';
import theme from '../../../styles/theme';

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

export const PurchaseOptionButton = styled(TouchableOpacity)<{ disabled: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-radius: 6px;
  background-color: ${({ disabled }) =>
    disabled ? theme.color['gray/gray100'] : theme.color['sub_color/indigo/bg']};
`;

export const PurchaseOptionList = styled(View)`
  width: 100%;
  gap: 8px;
  margin-top: 8px;
`;
