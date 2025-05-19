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
