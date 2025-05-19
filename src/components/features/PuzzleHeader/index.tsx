import React from 'react';
import {
  ActionButtonsWrapper,
  AutorText,
  HeaderContainer,
  LeftInfoWrapper,
  TitleText,
  TitleWrapper,
} from './index.styles';
import PuzzleAttributes from '../PuzzleAttributes';
import { CustomTag } from '../../common';
import PuzzleActionButton from '../PuzzleActionButton';

interface PuzzleHeaderProps {
  title: string;
  depth: number;
  winColor: 'BLACK' | 'WHITE';
  isSolved: boolean;
  isVerified?: boolean | null;
  isCommunityPuzzle?: boolean;
  displayNumber?: number;
}

const PuzzleHeader = ({
  title,
  depth,
  winColor,
  isSolved = false,
  isVerified,
  isCommunityPuzzle = false,
  displayNumber,
}: PuzzleHeaderProps) => {
  return (
    <HeaderContainer>
      <LeftInfoWrapper>
        <TitleWrapper>
          <TitleText weight="bold" lineHeight="sm" numberOfLines={1} ellipsizeMode="tail">
            {title}
          </TitleText>
          {isCommunityPuzzle && (
            <AutorText size={10} color="gray/gray500" weight="bold" lineHeight="lg">
              님 출제
            </AutorText>
          )}
          {!isCommunityPuzzle && displayNumber && <CustomTag>#{displayNumber}</CustomTag>}
          {isSolved && <CustomTag variant="highlight">풀이 완료</CustomTag>}
        </TitleWrapper>

        <PuzzleAttributes depth={depth} winColor={winColor} isVerified={isVerified} />
      </LeftInfoWrapper>

      <ActionButtonsWrapper>
        <PuzzleActionButton mode="showAnswer" onPress={() => {}} />
        <PuzzleActionButton mode="retry" onPress={() => {}} />
      </ActionButtonsWrapper>
    </HeaderContainer>
  );
};

export default PuzzleHeader;
