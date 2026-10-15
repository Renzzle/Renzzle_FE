import { View } from 'react-native';
import styled from 'styled-components';

export const Overlay = styled(View)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  align-items: center;
  justify-content: center;
`;

export const Box = styled(View)`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 10px;
  background-color: rgba(17, 17, 17, 0.84);
`;

export const InlineRow = styled(View)`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
`;
