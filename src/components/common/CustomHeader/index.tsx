import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import React from 'react';
import { menuThemeMap, MenuType } from '../../types/MenuThemeMap';
import { CurrencyWrapper, HeaderContainer, MenuWrapper } from './index.styles';
import MenuButton from '../../features/MenuButton';
import CustomText from '../CustomText';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '../../../store/useUserStore';
import Icon from '../Icon';

const CustomHeader: React.FC<NativeStackHeaderProps> = ({ options }) => {
  const { t } = useTranslation();
  const user = useUserStore((state) => state.user);

  const isHome = options.title === 'common.appName';

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
    <HeaderContainer>
      <MenuWrapper>{renderLeftContent()}</MenuWrapper>
      <CurrencyWrapper>{renderRightContent()}</CurrencyWrapper>
    </HeaderContainer>
  );
};

export default CustomHeader;
