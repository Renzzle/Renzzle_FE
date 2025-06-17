import { TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';
import theme from '../../../styles/theme';

export const Container = styled(View)`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-around;
  padding: 0 20px;
`;

export const StyledTabItem = styled(TouchableOpacity)<{ isSelected: boolean }>`
  border-bottom-width: 2px;
  border-bottom-color: ${({ isSelected }) =>
    isSelected ? theme.color['main_color/blue_s'] : 'transparent'};
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
`;
