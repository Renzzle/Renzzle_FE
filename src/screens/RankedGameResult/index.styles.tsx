import { TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';
import theme from '../../styles/theme';
import { RankingResultTheme, ResultVariant } from '../../types';

export const Container = styled(View)`
  flex: 1;
  background-color: ${theme.color['gray/grayBGDim']};
  position: relative;
`;

export const FixedTopWrapper = styled(View)`
  padding: 0 20px;
`;

export const HeroCard = styled(View)`
  align-items: center;
  gap: 8px;
  background-color: ${theme.color['gray/white']};
  border-radius: 13px;
  padding: 20px 20px 18px;
  margin-top: 12px;
`;

/* 좌우 대칭 슬롯(flex: 1) 사이에 숫자를 두어, 칩 유무와 무관하게 숫자가 정중앙에 오도록 함 */
export const RatingRow = styled(View)`
  align-self: stretch;
  flex-direction: row;
  align-items: center;
`;

export const RatingSideSlot = styled(View)<{ align: 'left' | 'right' }>`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: ${({ align }) => (align === 'left' ? 'flex-end' : 'flex-start')};
`;

export const DeltaChipPositioner = styled(View)`
  margin-left: 10px;
`;

export const DeltaChip = styled(View)<{ isPositive: boolean }>`
  flex-direction: row;
  align-items: center;
  background-color: ${({ isPositive }) =>
    isPositive ? theme.color['sub_color/indigo/bg'] : theme.color['sub_color/yellow/bg']};
  border-radius: 12px;
  padding: 5px 10px;
`;

export const StatsRow = styled(View)`
  flex-direction: row;
  gap: 10px;
  margin-top: 12px;
`;

export const StatCard = styled(View)`
  flex: 1;
  align-items: center;
  gap: 6px;
  background-color: ${theme.color['gray/white']};
  border-radius: 13px;
  padding: 14px 8px;
`;

export const RewardRow = styled(View)`
  flex-direction: row;
  align-items: center;
  gap: 10px;
  background-color: ${theme.color['sub_color/indigo/bg']};
  border-radius: 13px;
  padding: 13px 16px;
  margin-top: 12px;
`;

export const RewardLabelWrapper = styled(View)`
  flex: 1;
`;

export const SectionHeader = styled(View)`
  flex-direction: row;
  align-items: baseline;
  gap: 8px;
  margin-top: 22px;
  margin-bottom: 10px;
`;

export const ProblemRow = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  gap: 12px;
  background-color: ${theme.color['gray/white']};
  border-radius: 13px;
  padding: 11px 13px;
`;

export const ResultIconCircle = styled(View)<{ variant: ResultVariant }>`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${({ variant }) => theme.color[RankingResultTheme[variant].secondary]};
  align-items: center;
  justify-content: center;
`;

export const ProblemNumberWrapper = styled(View)`
  min-width: 32px;
`;

export const WinColorWrapper = styled(View)`
  flex: 1;
  flex-direction: row;
  align-items: center;
  gap: 5px;
`;

export const LoadingWrapper = styled(View)`
  padding: 24px 0;
`;
