import React, { useCallback, useRef, useState } from 'react';
import { ParamListBase, useFocusEffect, useNavigation } from '@react-navigation/native';
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
import { CustomModal, CustomText, Icon } from '../../components/common';
import { CommunityPuzzle, menuThemeMap, MenuType, TrainingPack } from '../../types';
import { useTranslation } from 'react-i18next';
import theme, { ColorType } from '../../styles/theme';
import { getRecommendPack, getTrendPuzzles } from '../../apis/content';
import { showBottomToast } from '../../components/common/Toast/toastMessage';
import PackCard from '../../components/features/PackCard';
import CommunityCard from '../../components/features/CommunityCard';
import useModal from '../../hooks/useModal';
import { BackHandler, Platform, ToastAndroid } from 'react-native';

const Home = () => {
  const backHandlerPressedOnce = useRef(false);
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const {
    isModalVisible,
    activateModal,
    closePrimarily,
    closeSecondarily,
    category: modalCategory,
  } = useModal();
  const [recommendPack, setRecommendPack] = useState<TrainingPack | null>(null);
  const [trendPuzzles, setTrendPuzzles] = useState<CommunityPuzzle[] | null>(null);

  const mainMenus: MenuType[] = ['trainingPuzzle', 'communityPuzzle', 'rankingPuzzle'];
  const subMenus: MenuType[] = ['ranking', 'myPuzzle', 'likes', 'notice', 'settings'];

  const getTextColor = (menu: MenuType, defaultColor: ColorType) =>
    menu === 'rankingPuzzle' ? 'sub_color/yellow/p' : defaultColor;

  const fetchRecommendPack = async () => {
    try {
      const data = await getRecommendPack('KO'); // TODO: 팩 언어 설정
      setRecommendPack(data);
    } catch (error) {
      showBottomToast('error', error as string);
      console.log(error);
    }
  };

  const handleRanking = () => {
    activateModal('RANKING_PUZZLE_INTRO', {
      primaryAction: () => {
        navigation.navigate('RankedPuzzleSolve');
      },
    });
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

  useFocusEffect(
    useCallback(() => {
      fetchRecommendPack();
      fetchTrendPuzzles();
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') {
        return;
      }

      const onBackPress = () => {
        if (backHandlerPressedOnce.current) {
          BackHandler.exitApp();
          return true;
        }

        backHandlerPressedOnce.current = true;
        ToastAndroid.show('한 번 더 누르면 종료됩니다.', ToastAndroid.SHORT);

        setTimeout(() => {
          backHandlerPressedOnce.current = false;
        }, 2000);

        // 기본 뒤로가기 동작 막기
        return true;
      };

      // 리스너 등록
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      // 화면이 포커스를 잃을 때 리스너 제거
      return () => subscription.remove();
    }, []),
  );

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
                onPress={
                  menu === 'rankingPuzzle'
                    ? handleRanking
                    : () => route && navigation.navigate(route)
                }>
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
              <SubMenuButton
                key={menu}
                onPress={() =>
                  route &&
                  (route === 'Home'
                    ? activateModal('FEATURE_IN_PROGRESS', { primaryAction: () => {} })
                    : navigation.navigate(route))
                }>
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
              onPress={() => navigation.navigate('TrainingPuzzles', { pack: recommendPack })}
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
                onPress={() => navigation.navigate('CommunityPuzzleSolve', { puzzle })}
              />
            ))}
          </ArticleWrapper>
        )}

        <CustomModal
          isVisible={isModalVisible}
          category={modalCategory}
          onPrimaryAction={closePrimarily}
          onSecondaryAction={closeSecondarily}
        />
      </HomeContainer>
    </ScrollContainer>
  );
};

export default Home;
