import { ScrollView, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';
import theme from '../../styles/theme';

export const Container = styled(View)`
  flex: 1;
  background-color: ${theme.color['gray/grayBG']};
  position: relative;
`;

// 공통 헤더(CustomHeader) 대신 쓰는 전용 헤더. 왼쪽 타이틀 영역은 공통 헤더와 같은 모양을 유지한다
export const Header = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 15px 28px;
`;

export const HeaderTitle = styled(View)`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

export const SkipButton = styled(TouchableOpacity)`
  padding: 4px 0;
`;

export const ScrollContainer = styled(ScrollView)`
  flex: 1;
`;

export const ContentWrapper = styled(View)`
  padding: 4px 20px 0;
  gap: 12px;
`;

export const ProgressHeader = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const ProgressTrack = styled(View)`
  height: 4px;
  border-radius: 2px;
  overflow: hidden;
  background-color: ${theme.color['gray/gray100']};
`;

export const ProgressFill = styled(View)<{ progress: number }>`
  width: ${({ progress }) => progress * 100}%;
  height: 100%;
  border-radius: 2px;
  background-color: ${theme.color['main_color/blue_p']};
`;

export const TextWrapper = styled(View)<{ minHeight?: number }>`
  gap: 8px;
  padding-top: 8px;
  min-height: ${({ minHeight = 0 }) => minHeight}px;
`;

// 보드가 있는 단계들의 글 영역 높이를 재기 위한 보이지 않는 영역 (ContentWrapper 안쪽과 같은 폭)
export const TextMeasurer = styled(View)`
  position: absolute;
  top: 0;
  left: 20px;
  right: 20px;
  opacity: 0;
`;

export const CardList = styled(View)`
  gap: 10px;
  padding: 20px 20px 0;
`;

export const Card = styled(View)`
  flex-direction: row;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 13px;
  background-color: ${theme.color['gray/gray50']};
`;

export const CardText = styled(View)`
  flex: 1;
  gap: 4px;
`;

export const ForbiddenLabel = styled(View)`
  min-width: 64px;
  padding: 8px 12px;
  border-radius: 16px;
  align-items: center;
  background-color: ${theme.color['sub_color/red/bg']};
`;

export const BoardWrapper = styled(View)`
  align-items: center;
`;

// 착수 결과를 한 줄로 보여주는 자리. 결과가 없을 때도 높이를 유지해 레이아웃이 움직이지 않는다
export const FeedbackSlot = styled(View)`
  height: 28px;
  padding: 0 20px;
  justify-content: center;
`;

export const FeedbackWrapper = styled(View)`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

export const FeedbackText = styled(View)`
  flex: 1;
`;

// BottomButtonBar(absolute, 약 68px)에 마지막 내용이 가려지지 않도록 확보하는 여백
export const BottomSpacer = styled(View)`
  height: 80px;
`;
