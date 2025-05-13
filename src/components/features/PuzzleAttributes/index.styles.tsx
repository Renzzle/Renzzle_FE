import { View } from 'react-native';
import styled from 'styled-components';

export const AttributesWrapper = styled(View)`
  display: flex;
  flex-direction: row;
  gap: 3px;
  align-items: center;
  margin: 3px 0 5px;
  flex-wrap: wrap;
`;

export const AttributeItemWrapper = styled(View)`
  display: flex;
  flex-direction: row;
  gap: 2px;
  align-items: center;
`;
