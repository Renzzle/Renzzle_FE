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
import { useTranslation } from 'react-i18next';

interface PuzzleHeaderProps {
  title: string;
  depth: number;
  winColor: 'BLACK' | 'WHITE';
  isSolved: boolean;
  isVerified?: boolean | null;
  isCommunityPuzzle?: boolean;
  displayNumber?: number;
  handleRetry?: () => void;
  handleShowAnswer?: () => void;
}

const PuzzleHeader = ({
  title,
  depth,
  winColor,
  isSolved = false,
  isVerified,
  isCommunityPuzzle = false,
  displayNumber,
  handleRetry,
  handleShowAnswer,
}: PuzzleHeaderProps) => {
  const { t } = useTranslation();
  return (
    <HeaderContainer>
      <LeftInfoWrapper>
        <TitleWrapper>
          <TitleText weight="bold" lineHeight="sm" numberOfLines={1} ellipsizeMode="tail">
            {title}
          </TitleText>
          {isCommunityPuzzle && (
            <AutorText size={10} color="gray/gray500" weight="bold" lineHeight="lg">
              {t('puzzle.author')}
            </AutorText>
          )}
          {!isCommunityPuzzle && displayNumber != null && <CustomTag>#{displayNumber}</CustomTag>}
          {isSolved && <CustomTag variant="highlight">{t('puzzle.solved')}</CustomTag>}
        </TitleWrapper>

        <PuzzleAttributes depth={depth} winColor={winColor} isVerified={isVerified} />
      </LeftInfoWrapper>

      <ActionButtonsWrapper>
        {handleShowAnswer && <PuzzleActionButton mode="showAnswer" onPress={handleShowAnswer} />}
        {handleRetry && <PuzzleActionButton mode="retry" onPress={handleRetry} />}
      </ActionButtonsWrapper>
    </HeaderContainer>
  );
};

export default PuzzleHeader;
