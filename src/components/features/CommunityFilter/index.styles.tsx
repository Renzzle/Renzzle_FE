import { View } from 'react-native';
import styled from 'styled-components';
import theme from '../../../styles/theme';

export const Container = styled(View)`
  gap: 15px;
`;

export const InputsWrapper = styled(View)`
  flex-direction: row;
  flex-wrap: wrap;
`;

export const InputWrapper = styled(View)`
  flex: 1;
`;

export const SliderWrapper = styled(View)`
  align-items: center;
  margin-top: -10px;
`;

export const selectedStyle = {
  backgroundColor: theme.color['main_color/blue_p'],
  height: 4,
};

export const unselectedStyle = {
  backgroundColor: theme.color['gray/gray100'],
  height: 4,
  borderRadius: 2,
};

export const markerStyle = {
  backgroundColor: theme.color['gray/white'],
  elevation: 2,
  borderWidth: 1,
  borderColor: theme.color['gray/gray50'],
  height: 20,
  width: 20,
};
