import React, { useCallback, useState } from 'react';
import { ButtonWrapper, Container, EmptyContainer } from './index.styles';
import InfiniteScrollList from '../../components/common/InfiniteScrollList';
import { CommunityPuzzle } from '../../types';
import { getCommunityPuzzles } from '../../apis/community';
import CommunityCard from '../../components/features/CommunityCard';
import { ParamListBase, useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CustomText, Icon } from '../../components/common';
import { useTranslation } from 'react-i18next';
import CircleButton from '../../components/features/CircleButton';

const CommunityPuzzles = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const { t } = useTranslation();
  const [refreshKey, setRefreshKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      // list refresh
      setRefreshKey((prev) => prev + 1);
    }, []),
  );

  const navigateToCommunityDetail = (puzzle: CommunityPuzzle) => {
    navigation.navigate('CommunityPuzzleSolve', { puzzle });
  };

  return (
    <Container>
      <InfiniteScrollList<CommunityPuzzle>
        key={refreshKey}
        apiCall={getCommunityPuzzles}
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
