import React from 'react';
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
  handleLikePress?: () => void;
}

const PuzzleHeader = ({ title, info, author, puzzleNum, isLiked = null, handleLikePress }: PuzzleHeaderProps) => {
  const width = useDeviceWidth();

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
            {puzzleNum &&
              <TagSmall>
                {`No.${puzzleNum}`}
              </TagSmall>
            }
          </TitleAndNumber>

          {isLiked !== null ? (
            <LikeButton onPress={handleLikePress}>
              {isLiked ? <HeartIcon /> : <HeartOutlineIcon />}
            </LikeButton>
          ) : (
            <View />
          )}
        </TopContainer>

        {info !== '' &&
          <CustomText size={10} lineHeight="sm" color="gray/gray500">
            {info}
          </CustomText>
        }

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
