import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import {
  Container,
  DeltaChip,
  HeroCard,
  LoadingWrapper,
  ProblemNumberWrapper,
  ProblemRow,
  RatingRow,
  ResultIconCircle,
  RewardLabelWrapper,
  RewardRow,
  SectionHeader,
  StatCard,
  StatsRow,
  WinColorWrapper,
} from './index.styles';
import { ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/ParamList';
import { RankArchive, RankingResultTheme, ResultVariant } from '../../types';
import { getRankGameArchive } from '../../apis/rank';
import { showBottomToast } from '../../components/common/Toast/toastMessage';
import { BottomButtonBar, CustomModal, CustomText, Icon } from '../../components/common';
import useModal from '../../hooks/useModal';
import { useTranslation } from 'react-i18next';
import theme from '../../styles/theme';

const RankedGameResult = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<RootStackParamList, 'RankedGameResult'>>();
  const { rating, reward, ratingDelta } = route.params ?? {};
  const {
    isModalVisible,
    activateModal,
    closePrimarily,
    closeSecondarily,
    category: modalCategory,
  } = useModal();
  const [archive, setArchive] = useState<RankArchive[] | null>(null);

  const isLoading = archive === null;
  const successCount = archive?.filter((item) => item.isSolved).length ?? 0;
  const failureCount = (archive?.length ?? 0) - successCount;
  const roundedDelta = ratingDelta !== undefined ? Math.round(ratingDelta) : undefined;

  useEffect(() => {
    const fetchArchive = async () => {
      try {
        const data = await getRankGameArchive();
        setArchive(data);
      } catch (error) {
        setArchive([]);
        showBottomToast('error', error as string);
      }
    };

    fetchArchive();
  }, []);

  const handleProblemPress = () => {
    // TODO: 복습 화면으로 이동
    activateModal('FEATURE_IN_PROGRESS', {
      primaryAction: () => {},
    });
  };

  const handleRetry = () => {
    activateModal('RANKING_PUZZLE_INTRO', {
      primaryAction: () => {
        navigation.replace('RankedPuzzleSolve');
      },
      secondaryAction: () => {},
    });
  };

  const renderProblemRow = ({ item, index }: { item: RankArchive; index: number }) => {
    const variant: ResultVariant = item.isSolved ? 'success' : 'error';
    const resultTheme = RankingResultTheme[variant];

    return (
      <ProblemRow onPress={handleProblemPress}>
        <ResultIconCircle variant={variant}>
          <Icon name={resultTheme.iconName} size={18} color={resultTheme.primary} />
        </ResultIconCircle>
        <ProblemNumberWrapper>
          <CustomText size={14} weight="bold" lineHeight="sm" color="gray/black">
            #{index + 1}
          </CustomText>
        </ProblemNumberWrapper>
        <WinColorInfo winColor={item.winColor} />
        <Icon name="ChevronRightCompactIcon" size={18} color="gray/gray300" />
      </ProblemRow>
    );
  };

  const listHeader = (
    <View>
      <HeroCard>
        <CustomText size={12} lineHeight="sm" color="gray/gray500">
          {t('rankedResult.myRating')}
        </CustomText>
        <RatingRow>
          <CustomText size={52} weight="bold" lineHeight="sm" color="gray/black">
            {rating !== undefined ? Math.round(rating).toLocaleString() : '-'}
          </CustomText>
          {roundedDelta !== undefined && roundedDelta !== 0 && (
            <DeltaChip isPositive={roundedDelta > 0}>
              <CustomText
                size={14}
                weight="bold"
                lineHeight="sm"
                color={roundedDelta > 0 ? 'main_color/blue_p' : 'sub_color/red/p'}>
                {roundedDelta > 0 ? `+${roundedDelta}` : `${roundedDelta}`}
              </CustomText>
            </DeltaChip>
          )}
        </RatingRow>
      </HeroCard>

      <StatsRow>
        <StatCard>
          <CustomText size={10} lineHeight="sm" color="gray/gray500">
            {t('rankedResult.totalCount')}
          </CustomText>
          <CustomText size={18} weight="bold" lineHeight="sm" color="gray/black">
            {archive?.length ?? 0}
          </CustomText>
        </StatCard>
        <StatCard>
          <CustomText size={10} lineHeight="sm" color="gray/gray500">
            {t('rankedResult.successCount')}
          </CustomText>
          <CustomText size={18} weight="bold" lineHeight="sm" color="main_color/blue_p">
            {successCount}
          </CustomText>
        </StatCard>
        <StatCard>
          <CustomText size={10} lineHeight="sm" color="gray/gray500">
            {t('rankedResult.failureCount')}
          </CustomText>
          <CustomText size={18} weight="bold" lineHeight="sm" color="main_color/yellow_p">
            {failureCount}
          </CustomText>
        </StatCard>
      </StatsRow>

      <RewardRow>
        <Icon name="PuzzleXSmallIcon" size={22} color="sub_color/yellow/p" />
        <RewardLabelWrapper>
          <CustomText size={12} lineHeight="sm" color="gray/gray600">
            {t('rankedResult.reward')}
          </CustomText>
        </RewardLabelWrapper>
        <CustomText size={14} weight="bold" lineHeight="sm" color="sub_color/yellow/p">
          {t('rankedResult.rewardPieces', { count: reward ?? 0 })}
        </CustomText>
      </RewardRow>

      <SectionHeader>
        <CustomText size={14} weight="bold" lineHeight="sm" color="gray/gray800">
          {t('rankedResult.reviewTitle')}
        </CustomText>
        <CustomText size={10} lineHeight="sm" color="gray/gray500">
          {t('rankedResult.reviewCaption')}
        </CustomText>
      </SectionHeader>
    </View>
  );

  return (
    <Container>
      <FlatList
        data={archive ?? []}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderProblemRow}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          isLoading ? (
            <LoadingWrapper>
              <ActivityIndicator color={theme.color['gray/gray300']} />
            </LoadingWrapper>
          ) : null
        }
        ItemSeparatorComponent={ItemSeparator}
        // eslint-disable-next-line react-native/no-inline-styles
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />

      <BottomButtonBar
        transitions={[
          {
            text: t('rankedResult.home'),
            onAction: () => {
              navigation.navigate('Home');
            },
          },
          {
            text: t('rankedResult.retry'),
            onAction: handleRetry,
          },
        ]}
      />

      <CustomModal
        isVisible={isModalVisible}
        category={modalCategory}
        onPrimaryAction={closePrimarily}
        onSecondaryAction={closeSecondarily}
      />
    </Container>
  );
};

// eslint-disable-next-line react-native/no-inline-styles
const ItemSeparator = () => <View style={{ height: 8 }} />;

const WinColorInfo = ({ winColor }: { winColor: 'BLACK' | 'WHITE' }) => {
  const { t } = useTranslation();

  return (
    <WinColorWrapper>
      <Icon
        name={winColor === 'BLACK' ? 'StoneBlackIcon' : 'StoneWhiteIcon'}
        size={14}
        color={winColor === 'BLACK' ? 'gray/black' : 'gray/white'}
      />
      <CustomText size={12} lineHeight="sm" color="gray/gray600">
        {winColor === 'BLACK' ? t('puzzle.blackWin') : t('puzzle.whiteWin')}
      </CustomText>
    </WinColorWrapper>
  );
};

export default RankedGameResult;
