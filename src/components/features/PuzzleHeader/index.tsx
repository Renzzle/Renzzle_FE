import React, { useState } from 'react';
import CustomText from '../../common/CustomText';
import { View } from 'react-native';
import { HeartIcon, HeartOutlineIcon } from '../../common/Icons';
import { AuthorContainer, HeaderContainer, LikeButton, TitleAndNumber, TitleContainer } from './index.styles';
import TagSmall from '../../common/TagSmall';

interface PuzzleHeaderProps {
  title: string;
  info: string;
  author: string;
  puzzleNum?: string;
  isLiked?: boolean | null;
}

const PuzzleHeader = ({ title, info, author, puzzleNum, isLiked = null }: PuzzleHeaderProps) => {
  const [like, setLike] = useState(isLiked);

  const handleLikePress = () => {
    if (like === null) {return;}
    setLike(!like);
  };

  return (
    <HeaderContainer>
      <View>
        <TitleContainer>
          <TitleAndNumber>
            <CustomText size={20} weight="bold" lineHeight="lg">{title}</CustomText>
            <TagSmall>{puzzleNum && `No.${puzzleNum}`}</TagSmall>
          </TitleAndNumber>

          {like !== null ? (
            <LikeButton onPress={handleLikePress}>
              {like ? <HeartIcon /> : <HeartOutlineIcon />}
            </LikeButton>
          ) : (
            <View />
          )}
        </TitleContainer>

        <CustomText size={10} lineHeight="sm" color="gray/gray500">{info}</CustomText>
      </View>

      <AuthorContainer>
        <CustomText size={14} lineHeight="sm">{author}</CustomText>
      </AuthorContainer>
    </HeaderContainer>
  );
};

export default PuzzleHeader;
