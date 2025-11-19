import { TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';
import theme from '../../styles/theme';

export const Container = styled(View)`
  flex: 1;
  background-color: ${theme.color['gray/grayBG']};
  position: relative;
  justify-content: center;
`;

export const BoardHeaderWrapper = styled(View)`
  height: 120px;
  justify-content: flex-end;
  padding: 0 40px 0 20px;
`;

export const BoardWrapper = styled(View)`
  flex: 1;
`;

export const UndoRedoWrapper = styled(View)`
  flex-direction: row;
  width: 100%;
  justify-content: center;
  gap: 60px;
  margin-top: 15px;

  height: 120px;
`;

export const Button = styled(TouchableOpacity)`
  padding: 3px;
`;

export const UndoButton = styled(Button)``;

export const RedoButton = styled(Button)``;

export const InputWrapper = styled(View)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 20px;
  z-index: 10;
`;
