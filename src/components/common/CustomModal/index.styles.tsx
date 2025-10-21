import { TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';
import theme from '../../../styles/theme';

export const ModalContainer = styled(View)<{ screenWidth: number }>`
  width: ${({ screenWidth }) => screenWidth - 40}px;
  margin: 0 20px;
  padding: 28px 20px 20px 20px;
  border-radius: 6px;
  background-color: ${theme.color['gray/white']};
  gap: 12px;
`;

export const CenteredView = styled(View)`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.8);
`;

export const ModalTopContainer = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const ModalTitleContainer = styled(View)`
  flex-direction: row;
  gap: 8px;
  align-items: center;
`;

export const ModalExitContainer = styled(TouchableOpacity)`
  flex-direction: row;
  gap: 3px;
  align-items: center;
`;

export const ModalBodyContainer = styled(View)`
  margin-bottom: 28px;
`;

export const ModalBottomContainer = styled(View)`
  flex-direction: row;
  gap: 12px;
`;
