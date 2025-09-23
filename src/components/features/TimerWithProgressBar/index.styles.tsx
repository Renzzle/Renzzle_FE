import { View } from 'react-native';
import styled from 'styled-components';

export const Container = styled(View)`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

export const TimeTextWrapper = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 3px;
  padding-left: 15px;
`;

export const TimerText = styled(View)`
  width: 60px;
`;
