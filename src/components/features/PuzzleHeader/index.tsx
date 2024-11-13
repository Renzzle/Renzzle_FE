import React, { useState } from 'react';
import CustomText from '../../common/CustomText';
import { View } from 'react-native';
import { HeartIcon, HeartOutlineIcon } from '../../common/Icons';
import { AuthorContainer, HeaderContainer, LikeButton, TitleAndNumber, TitleTextContainer, TopContainer } from './index.styles';
import TagSmall from '../../common/TagSmall';
import useDeviceWidth from '../../../hooks/useDeviceWidth';

interface PuzzleHeaderProps {
  title: string;
  info: string;
  author: string;
  puzzleNum?: string;
  isLiked?: boolean | null;
}

const PuzzleHeader = ({ title, info, author, puzzleNum, isLiked = null }: PuzzleHeaderProps) => {
  const [like, setLike] = useState(isLiked);
  const width = useDeviceWidth();

  const handleLikePress = () => {
    if (like === null) {return;}
    setLike(!like);
  };

  return (
    <HeaderContainer>
      <View>
        <TopContainer>
          <TitleAndNumber>
            <TitleTextContainer deviceWidth={width}>
              <CustomText size={20} weight="bold" lineHeight="lg" numberOfLines={1}>
                {title}
              </CustomText>
            </TitleTextContainer>
            <TagSmall>
              {puzzleNum && `No.${puzzleNum}`}
            </TagSmall>
          </TitleAndNumber>

          {like !== null ? (
            <LikeButton onPress={handleLikePress}>
              {like ? <HeartIcon /> : <HeartOutlineIcon />}
            </LikeButton>
          ) : (
            <View />
          )}
        </TopContainer>

        <CustomText size={10} lineHeight="sm" color="gray/gray500">
          {info}
        </CustomText>
      </View>

      <AuthorContainer>
        <CustomText size={14} lineHeight="sm">
          {author}
        </CustomText>
      </AuthorContainer>
    </HeaderContainer>
  );
};

export default PuzzleHeader;
