import React, { useEffect, useMemo, useRef } from 'react';
import { ButtonWrapper, Container, EmptyContainer } from './index.styles';
import InfiniteScrollList, {
  ApiCallParams,
  InfiniteScrollListRef,
} from '../../components/common/InfiniteScrollList';
import { CommunityPuzzle, RootStackParamList } from '../../types';
import { getCommunityPuzzles } from '../../apis/community';
import CommunityCard from '../../components/features/CommunityCard';
import { ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CustomText, Icon } from '../../components/common';
import { useTranslation } from 'react-i18next';
import CircleButton from '../../components/features/CircleButton';

const CommunityPuzzles = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<RootStackParamList, 'CommunityPuzzles'>>();
  const { t } = useTranslation();
  const listRef = useRef<InfiniteScrollListRef<CommunityPuzzle>>(null);

  // TODO: 검색 기능 추가 시 변수화 필요
  const apiParams = useMemo<Partial<ApiCallParams>>(() => ({}), []);

  const navigateToCommunityDetail = (puzzle: CommunityPuzzle) => {
    navigation.navigate('CommunityPuzzleSolve', { puzzle, fromScreen: 'CommunityPuzzles' });
  };

  // Optimistic update
  useEffect(() => {
    if (route.params?.updatedItem) {
      const { id, likeCount, views, isSolved } = route.params.updatedItem;

      listRef.current?.updateItem(id, (prevItem) => ({
        ...prevItem,
        likeCount: likeCount,
        views: views,
        isSolved: isSolved,
      }));

      navigation.setParams({ updatedItem: null });
    }
  }, [route.params?.updatedItem, navigation]);

  return (
    <Container>
      <InfiniteScrollList<CommunityPuzzle>
        ref={listRef}
        apiCall={getCommunityPuzzles}
        defaultParams={apiParams}
        renderItem={({ item }) => (
          <CommunityCard
            title={item.authorName}
            sequence={item.boardStatus}
            depth={item.depth}
            winColor={item.winColor}
            isVerified={item.isVerified}
            date={item.createdAt}
            puzzleId={item.id}
            views={item.views}
            solvedCount={item.solvedCount}
            likeCount={item.likeCount}
            isSolved={item.isSolved}
            onPress={() => navigateToCommunityDetail(item)}
          />
        )}
        keyExtractor={(item) => item && item.id.toString()}
        ListEmptyComponent={
          <EmptyContainer>
            <CustomText size={14} color="gray/gray500">
              {t('alert.noData')}
            </CustomText>
          </EmptyContainer>
        }
      />

      <ButtonWrapper>
        <CircleButton onPress={() => navigation.navigate('CreateCommunityPuzzle')}>
          <Icon name="PlusIcon" color="gray/white" />
        </CircleButton>
      </ButtonWrapper>
    </Container>
  );
};

export default CommunityPuzzles;
