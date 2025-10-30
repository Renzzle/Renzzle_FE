import { TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';
import theme from '../../styles/theme';

export const Container = styled(View)`
  flex: 1;
  background-color: ${theme.color['gray/grayBG']};
  position: relative;
  justify-content: center;
  padding-top: 65px;
`;

export const HeaderWrapper = styled(View)`
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

export const BoardWrapper = styled(View)`
  flex: 1;
  justify-content: center;
`;

export const UndoRedoWrapper = styled(View)`
  flex-direction: row;
  width: 100%;
  justify-content: center;
  gap: 60px;
  margin-top: 15px;

  height: 65px;
`;

export const Button = styled(TouchableOpacity)`
  padding: 3px;
`;

export const UndoButton = styled(Button)``;

export const RedoButton = styled(Button)``;
