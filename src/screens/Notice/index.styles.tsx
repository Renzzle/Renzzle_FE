import { View } from 'react-native';
import styled from 'styled-components';
import theme from '../../styles/theme';

export const Container = styled(View)`
  padding: 0 15px;
  background-color: ${theme.color['gray/grayBGDim']};
  flex: 1;
  position: relative;
`;

export const NoticeItemContent = styled(View)`
  flex: 1;
`;

export const NoticeHeader = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

export const NoticeTitleWrapper = styled(View)`
  flex: 1;
`;

export const ChevronWrapper = styled(View)<{ $isExpanded: boolean }>`
  transform: rotate(${({ $isExpanded }) => ($isExpanded ? '90deg' : '0deg')});
`;

export const NoticeContentWrapper = styled(View)`
  padding-top: 10px;
`;

export const ListSeparator = styled(View)`
  height: 10px;
`;

export const DateWrapper = styled(View)`
  padding-top: 14px;
  align-items: flex-end;
`;

export const LoadingContainer = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const EmptyContainer = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;
