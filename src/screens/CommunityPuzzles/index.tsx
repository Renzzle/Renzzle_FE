import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ButtonWrapper,
  Container,
  EmptyContainer,
  FilterButtonWrapper,
  SearchBarWrapper,
  SearchButtonWrapper,
  SearchWrapper,
} from './index.styles';
import InfiniteScrollList, { ApiCallParams } from '../../components/common/InfiniteScrollList';
import { CommunityPuzzle, DEPTH } from '../../types';
import { getCommunityPuzzles } from '../../apis/community';
import CommunityCard from '../../components/features/CommunityCard';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CustomModal, CustomText, CustomTextInput, Icon } from '../../components/common';
import { useTranslation } from 'react-i18next';
import CircleButton from '../../components/features/CircleButton';
import useOptimisticCommunityUpdate from '../../hooks/useOptimisticCommunityUpdate';
import useModal from '../../hooks/useModal';
import CommunityFilter, { FilterState } from '../../components/features/CommunityFilter';

const DEFAULT_FILTER: FilterState = {
  sort: 'LATEST',
  stone: { black: false, white: false },
  auth: { verified: false, unverified: false },
  depthRange: [DEPTH.MIN, DEPTH.SEARCH_MAX],
  solveStatus: { solved: false, unsolved: false },
};

const CommunityPuzzles = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const { t } = useTranslation();
  const {
    isModalVisible,
    activateModal,
    closePrimarily,
    closeSecondarily,
    category: modalCategory,
  } = useModal();
  const listRef = useOptimisticCommunityUpdate();

  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER);
  const [appliedFilter, setAppliedFilter] = useState<FilterState>(DEFAULT_FILTER);

  const filterRef = useRef<FilterState>(filter);
  useEffect(() => {
    filterRef.current = filter;
  }, [filter]);

  const [inputText, setInputText] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const handleFilterChange = (updated: Partial<FilterState>) => {
    setFilter((prev) => ({ ...prev, ...updated }));
  };

  const handleApplyFilter = () => {
    setAppliedFilter(filterRef.current);
  };

  const handleFilter = () => {
    setFilter(appliedFilter);
    activateModal('COMMUNITY_FILTER', { primaryAction: handleApplyFilter });
  };

  const handleSearchSubmit = () => {
    setAppliedQuery(inputText);
  };

  const navigateToCommunityDetail = (puzzle: CommunityPuzzle) => {
    navigation.navigate('CommunityPuzzleSolve', { puzzle, fromScreen: 'CommunityPuzzles' });
  };

  const apiParams = useMemo<Partial<ApiCallParams>>(() => {
    const depthMin = Math.max(DEPTH.MIN, appliedFilter.depthRange[0]);
    let depthMax = Math.min(appliedFilter.depthRange[1], DEPTH.SEARCH_MAX);
    if (depthMax === DEPTH.SEARCH_MAX) {
      depthMax = DEPTH.MAX;
    }

    const params: Record<string, any> = {
      sort: appliedFilter.sort,
      depthMin: depthMin,
      depthMax: depthMax,
    };

    // 검색어 추가
    if (appliedQuery) {
      params.query = appliedQuery;
    }

    // 흑/백
    if (appliedFilter.stone.black && !appliedFilter.stone.white) {
      params.stone = 'BLACK';
    }
    if (!appliedFilter.stone.black && appliedFilter.stone.white) {
      params.stone = 'WHITE';
    }

    // 인증 여부
    if (appliedFilter.auth.verified && !appliedFilter.auth.unverified) {
      params.auth = true;
    }
    if (!appliedFilter.auth.verified && appliedFilter.auth.unverified) {
      params.auth = false;
    }

    // 풀이 여부
    if (appliedFilter.solveStatus.solved && !appliedFilter.solveStatus.unsolved) {
      params.solved = true;
    }
    if (!appliedFilter.solveStatus.solved && appliedFilter.solveStatus.unsolved) {
      params.solved = false;
    }
    return params;
  }, [appliedFilter, appliedQuery]);

  return (
    <Container>
      <SearchWrapper>
        <SearchBarWrapper>
          <CustomTextInput
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSearchSubmit}
            placeholder={t('placeholder.communitySearch')}
            rightElement={
              <SearchButtonWrapper onPress={handleSearchSubmit}>
                <Icon name="SearchIcon" color="gray/gray400" />
              </SearchButtonWrapper>
            }
          />
        </SearchBarWrapper>
        <FilterButtonWrapper onPress={handleFilter}>
          <Icon name="FilterIcon" color="gray/gray500" />
        </FilterButtonWrapper>
      </SearchWrapper>

      <InfiniteScrollList<CommunityPuzzle>
        ref={listRef}
        apiCall={getCommunityPuzzles}
        defaultParams={apiParams}
        keyboardDismissMode="on-drag"
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

      <CustomModal
        isVisible={isModalVisible}
        category={modalCategory}
        onPrimaryAction={closePrimarily}
        onSecondaryAction={closeSecondarily}>
        <CommunityFilter filter={filter} onChangeFilter={handleFilterChange} />
      </CustomModal>
    </Container>
  );
};

export default CommunityPuzzles;
