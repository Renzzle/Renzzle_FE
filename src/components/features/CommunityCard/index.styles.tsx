import { TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';
import theme from '../../../styles/theme';

export const CardContainer = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  gap: 15px;
  background-color: ${theme.color['gray/white']};
  padding: 15px;
  border-radius: 13px;
`;

export const ContentWrapper = styled(View)`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const TitleWrapper = styled(View)<{ showDeleteIcon: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: ${({ showDeleteIcon }) => (showDeleteIcon ? 'space-between' : 'flex-start')};
  align-items: center;
`;

export const MetaInfoWrapper = styled(View)`
  display: flex;
  flex-direction: row;
  gap: 3px;
  align-items: center;
  margin: 3px 0 5px;
  flex-wrap: wrap;
`;

export const MetaInfoItemWrapper = styled(View)`
  display: flex;
  flex-direction: row;
  gap: 2px;
  align-items: center;
`;

export const StatsWrapper = styled(View)`
  display: flex;
  flex-direction: row;
  gap: 5px;
  justify-content: flex-end;
  flex-wrap: wrap;
`;

export const StatsItemWrapper = styled(View)`
  display: flex;
  flex-direction: row;
`;
