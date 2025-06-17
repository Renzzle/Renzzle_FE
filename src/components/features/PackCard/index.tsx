import React from 'react';
import {
  AuthorWrapper,
  CardContainerButton,
  CardContainerView,
  CardRightWrapper,
  PriceWrapper,
} from './index.styles';
import { View } from 'react-native';
import { CustomText, Icon } from '../../common';

interface PackCardProps {
  title: string;
  author: string;
  description: string;
  price: number;
  totalPuzzleCount: number;
  solvedPuzzleCount: number;
  isLocked: boolean;
  variant?: 'default' | 'minimal';
  onPress: () => void;
}

const PackCard = ({
  title,
  author,
  description,
  price,
  totalPuzzleCount,
  solvedPuzzleCount,
  isLocked,
  variant = 'default',
  onPress,
}: PackCardProps) => {
  const primaryColor = isLocked ? 'gray/gray400' : 'gray/gray900';
  const secondaryColor = isLocked ? 'gray/gray400' : 'main_color/blue_s';
  const tertiaryColor = isLocked ? 'gray/gray400' : 'gray/gray500';

  const ContainerComponent: React.ElementType =
    variant === 'minimal' ? CardContainerView : CardContainerButton;

  return (
    <ContainerComponent onPress={variant === 'default' ? onPress : undefined}>
      <View>
        <CustomText size={16} weight="bold" color={primaryColor}>
          {title}
        </CustomText>
        <AuthorWrapper>
          <Icon name="AuthenticatedUserIcon" color={secondaryColor} />
          <CustomText size={10} weight="bold" lineHeight="sm" color={secondaryColor}>
            {author}
          </CustomText>
        </AuthorWrapper>
        <CustomText size={8} lineHeight="sm" color={tertiaryColor}>
          {description}
        </CustomText>
      </View>
      <CardRightWrapper>
        {isLocked ? (
          <>
            <Icon name="LockIcon" size={30} color={secondaryColor} />
            <PriceWrapper>
              <Icon name="PuzzleXSmallIcon" color={secondaryColor} size={12} />
              <CustomText size={10} weight="bold" lineHeight="sm" color={secondaryColor}>
                {price}
              </CustomText>
            </PriceWrapper>
          </>
        ) : (
          <>
            <Icon name="BookShelfIcon" size={30} />
            <CustomText size={10} weight="bold" lineHeight="sm" color={secondaryColor}>
              {solvedPuzzleCount}/{totalPuzzleCount}
            </CustomText>
          </>
        )}
      </CardRightWrapper>
    </ContainerComponent>
  );
};

export default PackCard;
