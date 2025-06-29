import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import React from 'react';
import { menuThemeMap, MenuType } from '../../types/MenuThemeMap';
import { CurrencyWrapper, HeaderContainer, MenuWrapper } from './index.styles';
import MenuButton from '../../features/MenuButton';
import CustomText from '../CustomText';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '../../../store/useUserStore';
import Icon from '../Icon';
import theme from '../../../styles/theme';

const CustomHeader: React.FC<NativeStackHeaderProps> = ({ options, route }) => {
  const { t } = useTranslation();
  const user = useUserStore((state) => state.user);

  const isHome = route.name === 'Home';

  const grayBGRoutes = [
    'Signup',
    'TrainingPuzzleSolve',
    'CommunityPuzzleSolve',
    'CreateCommunityPuzzle',
    'RankedPuzzleSolve',
  ];
  const backgroundColor = grayBGRoutes.includes(route.name)
    ? theme.color['gray/grayBG']
    : theme.color['gray/grayBGDim'];

  const matchedEntry = Object.entries(menuThemeMap).find(
    ([, value]) => value.titleKey === options.title,
  );
  const matchedType = matchedEntry?.[0] as MenuType | undefined;

  const renderLeftContent = () => {
    if (isHome) {
      return (
        <CustomText size={16} lineHeight="sm">
          {user?.nickname}
        </CustomText>
      );
    }

    return (
      <>
        {matchedType && <MenuButton type={matchedType} size={30} />}
        <CustomText size={18} lineHeight="sm">
          {options.title && t(options.title)}
        </CustomText>
      </>
    );
  };

  const renderRightContent = () => {
    if (user) {
      return (
        <>
          <CustomText size={12} weight="bold" lineHeight="sm" color="main_color/blue_p">
            {user?.currency}
            {user && t('puzzle.piece')}
          </CustomText>
          <Icon name="PuzzlePlusIcon" color="main_color/blue_p" size={22} />
        </>
      );
    }
  };

  return (
    <HeaderContainer backgroundColor={backgroundColor}>
      <MenuWrapper>{renderLeftContent()}</MenuWrapper>
      <CurrencyWrapper>{renderRightContent()}</CurrencyWrapper>
    </HeaderContainer>
  );
};

export default CustomHeader;
