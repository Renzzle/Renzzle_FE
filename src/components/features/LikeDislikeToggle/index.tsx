import React from 'react';
import { ReactionType } from '../../types/Community';
import { Container, DislikeButton, LikeButton, VerticalDivider } from './index.styles';
import { CustomText, Icon } from '../../common';

interface LikeDislikeToggleProps {
  value: ReactionType;
  likeCount: number;
  onChange: (value: ReactionType) => void;
}

const LikeDislikeToggle = ({ value, likeCount, onChange }: LikeDislikeToggleProps) => {
  const handleLikeClick = () => {
    onChange(value === 'like' ? null : 'like');
    console.log('like click:', value);
  };

  const handleDislikeClick = () => {
    onChange(value === 'dislike' ? null : 'dislike');
    console.log('dislike click:', value);
  };

  return (
    <Container>
      <LikeButton onPress={handleLikeClick}>
        <Icon
          name="HeartActiveIcon"
          size={16}
          color={value === 'like' ? 'sub_color/red/p' : 'gray/gray300'}
        />
        <CustomText size={12} lineHeight="sm" color="gray/gray500">
          {likeCount}
        </CustomText>
      </LikeButton>

      <VerticalDivider />

      <DislikeButton onPress={handleDislikeClick}>
        <Icon
          name="ConfusedActiveIcon"
          size={16}
          color={value === 'dislike' ? 'sub_color/indigo/p' : 'gray/gray300'}
        />
      </DislikeButton>
    </Container>
  );
};

export default LikeDislikeToggle;
