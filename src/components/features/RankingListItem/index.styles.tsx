import { TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import theme from '../../../styles/theme';
import { CustomText } from '../../common';

export const CardContainer = styled(TouchableOpacity)<{
  category: 'rating' | 'best';
  isCurrentUser?: boolean;
}>`
  display: flex;
  flex-direction: row;
  background-color: ${({ isCurrentUser, category }) =>
    isCurrentUser
      ? category === 'rating'
        ? theme.color['sub_color/yellow/bg']
        : theme.color['sub_color/indigo/bg']
      : theme.color['gray/white']};
  padding: 11px 13px;
  border-radius: 13px;
  align-items: center;
  ${({ isCurrentUser }) =>
    isCurrentUser &&
    `
    shadow-color: ${theme.color['gray/black']};
    shadow-offset: 0px 0px;
    shadow-opacity: 0.2;
    shadow-radius: 4px;
    elevation: 3;
  `}
`;

export const RankText = styled(CustomText)`
  min-width: 40px;
  text-align: center;
  margin-right: 5px;
`;

export const NameText = styled(CustomText)`
  flex: 1;
  min-width: 0px;
  overflow: hidden;
`;

export const ScoreText = styled(CustomText)`
  margin-left: 15px;
`;
