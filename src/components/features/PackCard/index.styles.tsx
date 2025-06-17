import { TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';
import theme from '../../../styles/theme';

export const CardContainerButton = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${theme.color['gray/white']};
  padding: 20px 30px;
  border-radius: 13px;
  width: 100%;
`;

export const CardContainerView = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: transparent;
  padding: 20px 30px;
  border-radius: 13px;
  width: 100%;
`;

export const AuthorWrapper = styled(View)`
  display: flex;
  flex-direction: row;
  gap: 3px;
  margin: 5px 0 3px;
`;

export const CardRightWrapper = styled(View)`
  display: flex;
  align-items: center;
  min-width: 53px;
  gap: 1px;
`;

export const PriceWrapper = styled(View)`
  display: flex;
  flex-direction: row;
  gap: 2px;
  align-items: center;
`;
