import { TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';
import theme from '../../styles/theme';

export const Container = styled(View)`
  padding: 0 15px;
  background-color: ${theme.color['gray/grayBGDim']};
  flex: 1;
`;

export const EmptyContainer = styled(View)`
  height: 100%;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

export const ButtonWrapper = styled(View)`
  position: absolute;
  bottom: 25px;
  right: 25px;
`;

export const SearchWrapper = styled(View)`
  flex-direction: row;
  justify-content: flex-end;
  padding: 0 0 10px;
`;

export const SearchBarWrapper = styled(View)`
  position: relative;
  flex: 1;
`;

export const SearchButtonWrapper = styled(TouchableOpacity)`
  padding: 8px;
  overflow: hidden;
`;

export const FilterButtonWrapper = styled(TouchableOpacity)`
  justify-content: center;
  align-items: center;
  padding: 8px;
`;
