import { View } from 'react-native';
import styled from 'styled-components';
import { CustomText } from '../../common';

export const HeaderContainer = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  gap: 10px;
`;

export const LeftInfoWrapper = styled(View)`
  display: flex;
  gap: 9px;
  flex: 1;
`;

export const TitleWrapper = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-end;
  gap: 6px;
`;

export const TitleText = styled(CustomText)`
  min-width: 0px;
  overflow: hidden;
  flex-shrink: 1;
`;

export const AutorText = styled(CustomText)`
  margin-left: -5px;
`;

export const ActionButtonsWrapper = styled(View)`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;
