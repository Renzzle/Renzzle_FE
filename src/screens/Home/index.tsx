import React, { useEffect, useState } from 'react';
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
import { CommunityPuzzle, TrainingPack } from '../../components/types';
import { getRecommendPack, getTrendPuzzles } from '../../apis/content';
import { showBottomToast } from '../../components/common/Toast/toastMessage';
import PackCard from '../../components/features/PackCard';
import CommunityCard from '../../components/features/CommunityCard';

const Home = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [recommendPack, setRecommendPack] = useState<TrainingPack | null>(null);
  const [trendPuzzles, setTrendPuzzles] = useState<CommunityPuzzle[] | null>(null);

  const mainMenus: MenuType[] = ['trainingPuzzle', 'communityPuzzle', 'rankingPuzzle'];
  const subMenus: MenuType[] = ['ranking', 'myPuzzle', 'likes', 'notice', 'settings'];

  const getTextColor = (menu: MenuType, defaultColor: ColorType) =>
    menu === 'rankingPuzzle' ? 'sub_color/yellow/p' : defaultColor;

  const fetchRecommendPack = async () => {
    try {
      const data = await getRecommendPack('KO');
      setRecommendPack(data);
    } catch (error) {
      showBottomToast('error', error as string);
      console.log(error);
    }
  };

  const fetchTrendPuzzles = async () => {
    try {
      const data = await getTrendPuzzles();
      setTrendPuzzles(data);
    } catch (error) {
      showBottomToast('error', error as string);
      console.log(error);
    }
  };

  useEffect(() => {
    if (!recommendPack) {
      fetchRecommendPack();
    }
    if (!trendPuzzles) {
      fetchTrendPuzzles();
    }
  }, [recommendPack, trendPuzzles]);

  return (
    <ScrollContainer showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
      <HomeContainer>
        <MainMenuWrapper>
          {mainMenus.map((menu) => {
            const { background, iconColor, titleKey, route } = menuThemeMap[menu];
            const bgColor = theme.color[background];
            const textColor = getTextColor(menu, iconColor);

            return (
              <MainMenuButton
                key={menu}
                backgroundColor={bgColor}
                onPress={() => route && navigation.navigate(route)}>
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
            const { titleKey, route } = menuThemeMap[menu];

            return (
              <SubMenuButton key={menu} onPress={() => route && navigation.navigate(route)}>
                <MenuButton type={menu} size={40} />
                <CustomText size={12} weight="bold" lineHeight="sm">
                  {t(titleKey)}
                </CustomText>
              </SubMenuButton>
            );
          })}
        </SubMenuWrapper>

        {recommendPack && (
          <ArticleWrapper>
            <ArticleTitle>
              <Icon name="PuzzleSquareIcon" color="main_color/yellow_p" size={24} />
              <CustomText size={12} weight="bold" lineHeight="sm">
                {t('home.recommendedBook')}
              </CustomText>
            </ArticleTitle>
            <PackCard
              title={recommendPack.title}
              author={recommendPack.author}
              description={recommendPack.description}
              price={recommendPack.price}
              totalPuzzleCount={recommendPack.totalPuzzleCount}
              solvedPuzzleCount={recommendPack.solvedPuzzleCount}
              isLocked={recommendPack.locked}
              onPress={() => {
                navigation.navigate('TrainingPuzzles', { pack: recommendPack });
              }}
            />
          </ArticleWrapper>
        )}

        {trendPuzzles && (
          <ArticleWrapper>
            <ArticleTitle>
              <Icon name="HotIcon" color="main_color/yellow_s" size={24} />
              <CustomText size={12} weight="bold" lineHeight="sm">
                {t('home.featuredPuzzle')}
              </CustomText>
            </ArticleTitle>
            {trendPuzzles.map((puzzle, index) => (
              <CommunityCard
                key={index}
                title={puzzle.authorName}
                sequence={puzzle.boardStatus}
                depth={puzzle.depth}
                winColor={puzzle.winColor}
                isVerified={puzzle.isVerified}
                date={puzzle.createdAt}
                puzzleId={puzzle.id}
                views={puzzle.views}
                solvedCount={puzzle.solvedCount}
                likeCount={puzzle.likeCount}
                isSolved={puzzle.isSolved}
                onPress={() => {}}
              />
            ))}
          </ArticleWrapper>
        )}
      </HomeContainer>
    </ScrollContainer>
  );
};

export default Home;
