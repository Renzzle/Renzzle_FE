/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { ActiveTabContainer, Container, DescText, MyRankingContainer } from './index.styles';
import TabBar from '../../components/common/TabBar';
import { getCommunityRanking, getRatingRanking } from '../../apis/rank';
import { BestRankingResponse, RatingRankingResponse } from '../../types';
import { showBottomToast } from '../../components/common/Toast/toastMessage';
import RankingListItem from '../../components/features/RankingListItem';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import theme from '../../styles/theme';

const Ranking = () => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = useState('RATING');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [ratingRankingResponse, setRatingRankingResponse] = useState<RatingRankingResponse | null>(
    null,
  );
  const [bestRankingResponse, setBestRankingResponse] = useState<BestRankingResponse | null>(null);

  const fetchRankingData = useCallback(async () => {
    if (currentTab === 'RATING' && ratingRankingResponse) {
      return;
    }
    if (currentTab === 'BEST' && bestRankingResponse) {
      return;
    }

    setLoading(true);
    try {
      if (currentTab === 'RATING') {
        const data = await getRatingRanking();
        setRatingRankingResponse(data);
      } else if (currentTab === 'BEST') {
        const data = await getCommunityRanking();
        setBestRankingResponse(data);
      }
    } catch (error) {
      showBottomToast('error', error as string);
    } finally {
      setLoading(false);
    }
  }, [currentTab, ratingRankingResponse, bestRankingResponse]);

  useEffect(() => {
    fetchRankingData();
  }, [fetchRankingData]);

  // Pull-to-Refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      if (currentTab === 'RATING') {
        const data = await getRatingRanking();
        setRatingRankingResponse(data);
      } else if (currentTab === 'BEST') {
        const data = await getCommunityRanking();
        setBestRankingResponse(data);
      }
    } catch (error) {
      showBottomToast('error', error as string);
    } finally {
      setRefreshing(false);
    }
  };

  const tabs = [
    { key: 'RATING', title: '레이팅', component: () => null },
    { key: 'BEST', title: '베스트 퍼즐러', component: () => null },
  ];

  const description = () => {
    if (currentTab === 'RATING') {
      return t('ranking.ratingDescription');
    }
    if (currentTab === 'BEST') {
      return t('ranking.bestDescription');
    }
  };

  const myRanking = () => {
    if (currentTab === 'RATING' && ratingRankingResponse && ratingRankingResponse.myRatingRank) {
      return (
        <RankingListItem
          rank={ratingRankingResponse.myRatingRank.rank}
          nickname={ratingRankingResponse.myRatingRank.nickname}
          score={ratingRankingResponse.myRatingRank.rating}
          category="rating"
          isCurrentUser
        />
      );
    }
    if (currentTab === 'BEST' && bestRankingResponse && bestRankingResponse.myPuzzlerRank) {
      return (
        <RankingListItem
          rank={bestRankingResponse.myPuzzlerRank.rank}
          nickname={bestRankingResponse.myPuzzlerRank.nickname}
          score={bestRankingResponse.myPuzzlerRank.score}
          category="best"
          isCurrentUser
        />
      );
    }
    return null;
  };

  return (
    <Container>
      <TabBar tabs={tabs} currentTab={currentTab} onTabPress={setCurrentTab} />
      <DescText size={8} lineHeight="sm" color="gray/gray500">
        {description()}
      </DescText>
      <ActiveTabContainer>
        {loading ? (
          <ActivityIndicator color={theme.color['gray/gray300']} style={{ marginVertical: 16 }} />
        ) : currentTab === 'RATING' ? (
          <FlatList
            data={ratingRankingResponse?.top100 ?? []}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <RankingListItem
                rank={item.rank}
                nickname={item.nickname}
                score={item.rating}
                category="rating"
              />
            )}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            showsVerticalScrollIndicator={false}
            onRefresh={onRefresh}
            refreshing={refreshing}
            contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
          />
        ) : (
          <FlatList
            data={bestRankingResponse?.top100 ?? []}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <RankingListItem
                rank={item.rank}
                nickname={item.nickname}
                score={item.score}
                category="best"
              />
            )}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            showsVerticalScrollIndicator={false}
            onRefresh={onRefresh}
            refreshing={refreshing}
            contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
          />
        )}
      </ActiveTabContainer>
      <MyRankingContainer insetsBottom={insets.bottom}>{myRanking()}</MyRankingContainer>
    </Container>
  );
};

export default Ranking;
