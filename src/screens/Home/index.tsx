import React from 'react';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import {
  ArticleTitle,
  ArticleWrapper,
  HomeContainer,
  MainMenuButton,
  MainMenuText,
  MainMenuWrapper,
  ScrollContainer,
  SubMenuButton,
  SubMenuWrapper,
} from './index.styles';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MenuButton from '../../components/features/MenuButton';
import { CustomText, Icon } from '../../components/common';
import { menuThemeMap, MenuType } from '../../components/types/MenuThemeMap';
import { useTranslation } from 'react-i18next';
import theme, { ColorType } from '../../styles/theme';

const Home = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const mainMenus: MenuType[] = ['trainingPuzzle', 'communityPuzzle', 'rankingPuzzle'];
  const subMenus: MenuType[] = ['ranking', 'myPuzzle', 'likes', 'notice', 'settings'];

  const getTextColor = (menu: MenuType, defaultColor: ColorType) =>
    menu === 'rankingPuzzle' ? 'sub_color/yellow/p' : defaultColor;

  return (
    <ScrollContainer showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
      <HomeContainer>
        <MainMenuWrapper>
          {mainMenus.map((menu) => {
            const { background, iconColor, titleKey } = menuThemeMap[menu];
            const bgColor = theme.color[background];
            const textColor = getTextColor(menu, iconColor);

            return (
              <MainMenuButton key={menu} backgroundColor={bgColor}>
                <MenuButton type={menu} size={120} />
                <MainMenuText>
                  {['', 'Description'].map((suffix, index) => (
                    <CustomText
                      key={suffix}
                      size={index === 0 ? 22 : 10}
                      weight="bold"
                      lineHeight={index === 0 ? 'lg' : 'sm'}
                      color={textColor}>
                      {t(`${titleKey}${suffix}`)}
                    </CustomText>
                  ))}
                </MainMenuText>
              </MainMenuButton>
            );
          })}
        </MainMenuWrapper>

        <SubMenuWrapper>
          {subMenus.map((menu) => {
            const { titleKey } = menuThemeMap[menu];

            return (
              <SubMenuButton key={menu}>
                <MenuButton type={menu} size={40} />
                <CustomText size={12} weight="bold" lineHeight="sm">
                  {t(titleKey)}
                </CustomText>
              </SubMenuButton>
            );
          })}
        </SubMenuWrapper>

        <ArticleWrapper>
          <ArticleTitle>
            <Icon name="PuzzleSquareIcon" color="main_color/yellow_p" size={24} />
            <CustomText size={12} weight="bold" lineHeight="sm">
              {t('home.recommendedBook')}
            </CustomText>
          </ArticleTitle>
        </ArticleWrapper>

        <ArticleWrapper>
          <ArticleTitle>
            <Icon name="HotIcon" color="main_color/yellow_s" size={24} />
            <CustomText size={12} weight="bold" lineHeight="sm">
              {t('home.featuredPuzzle')}
            </CustomText>
          </ArticleTitle>
        </ArticleWrapper>
      </HomeContainer>
    </ScrollContainer>
  );
};

export default Home;
