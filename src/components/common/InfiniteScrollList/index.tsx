/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  FlatList,
  FlatListProps,
  RefreshControl,
  TouchableOpacity,
  View,
} from 'react-native';
import theme from '../../../styles/theme';
import { showBottomToast } from '../Toast/toastMessage';
import { useTranslation } from 'react-i18next';
import CustomText from '../CustomText';

export interface ApiCallParams {
  id?: number | null;
  size?: number;
  sort?: 'LATEST' | 'LIKE' | 'RECOMMEND';
  shuffleSeed?: number;
  stone?: 'BLACK' | 'WHITE';
  auth?: boolean;
  depthMin?: number;
  depthMax?: number;
  solved?: boolean;
  query?: string;
  [key: string]: any; // 확장을 위한 유연성 확보
}

interface InfiniteScrollListProps<T>
  extends Omit<FlatListProps<T>, 'data' | 'renderItem' | 'keyExtractor'> {
  apiCall: (params: ApiCallParams) => Promise<T[]>;
  renderItem: ({ item }: { item: T }) => React.ReactElement;
  keyExtractor: (item: T, index: number) => string;
  pageSize?: number;
  defaultParams?: Partial<ApiCallParams>;
  getRefreshParams?: () => Partial<ApiCallParams>;
  onEndReachedThreshold?: number;
  ListEmptyComponent?: React.ReactElement;
}

export interface InfiniteScrollListRef<T> {
  updateItem: (itemId: number, updater: (prevItem: T) => T) => void;
  removeItem: (id: number) => void;
}

const InfiniteScrollList = forwardRef<InfiniteScrollListRef<any>, InfiniteScrollListProps<any>>(
  (
    {
      apiCall,
      renderItem,
      keyExtractor,
      pageSize = 10,
      defaultParams,
      getRefreshParams,
      onEndReachedThreshold = 0.6,
      ListEmptyComponent,
      ...flatListProps
    },
    ref,
  ) => {
    const { t } = useTranslation();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [cursorId, setCursorId] = useState<number | null>(null);
    // 다음 페이지를 못 불러오면 끝에 닿을 때마다 다시 요청하지 않고, 사용자가 다시 시도할 때까지 멈춘다
    const [hasPageError, setHasPageError] = useState(false);
    const hasPageErrorRef = useRef(false);
    const isFetchingPageRef = useRef(false);
    // 새로고침할 때마다 올려서, 그 전에 보낸 요청의 늦은 응답은 버린다
    const generationRef = useRef(0);

    // Params fixed at the last refresh and carried through cursor pagination
    const refreshParamsRef = useRef<Partial<ApiCallParams>>({});
    const getRefreshParamsRef = useRef(getRefreshParams);
    useEffect(() => {
      getRefreshParamsRef.current = getRefreshParams;
    }, [getRefreshParams]);

    useImperativeHandle(ref, () => ({
      updateItem: (itemId: number, updater: (prevItem: any) => any) => {
        setData((prevData) =>
          prevData.map((item) => {
            if (String(item.id) === String(itemId)) {
              return updater(item); // ID가 같으면 업데이트 함수 실행
            }
            return item;
          }),
        );
      },
      removeItem: (id: number) => {
        setData((prevData) => prevData.filter((item) => item.id !== id));
      },
    }));

    const fetchData = useCallback(async () => {
      if (isFetchingPageRef.current || hasPageErrorRef.current || !hasMore || refreshing) {
        return;
      }

      const generation = generationRef.current;
      isFetchingPageRef.current = true;
      setLoading(true);
      try {
        const fetched = await apiCall({
          ...defaultParams,
          ...refreshParamsRef.current,
          id: cursorId,
          size: pageSize,
        });

        if (generation !== generationRef.current) {
          return;
        }

        setData((prev) => [...prev, ...fetched]);
        setHasMore(fetched.length === pageSize);

        if (fetched.length > 0) {
          const lastItem = fetched[fetched.length - 1] as any;
          setCursorId(lastItem.id ?? null);
        }
      } catch (err) {
        if (generation === generationRef.current) {
          hasPageErrorRef.current = true;
          setHasPageError(true);
          showBottomToast('error', t('toast.listLoadError'));
        }
      } finally {
        if (generation === generationRef.current) {
          isFetchingPageRef.current = false;
          setLoading(false);
        }
      }
    }, [apiCall, hasMore, refreshing, cursorId, defaultParams, pageSize, t]);

    const retryPage = () => {
      hasPageErrorRef.current = false;
      setHasPageError(false);
      fetchData();
    };

    const onRefresh = useCallback(async () => {
      const generation = ++generationRef.current;
      isFetchingPageRef.current = false;
      hasPageErrorRef.current = false;
      setLoading(false);
      setHasPageError(false);
      setRefreshing(true);
      setHasMore(true);

      refreshParamsRef.current = getRefreshParamsRef.current?.() ?? {};

      try {
        const fetched = await apiCall({
          ...defaultParams,
          ...refreshParamsRef.current,
          id: null,
          size: pageSize,
        });

        if (generation !== generationRef.current) {
          return;
        }

        setData(fetched); // 덮어쓰기

        if (fetched.length > 0) {
          const lastItem = fetched[fetched.length - 1] as any;
          setCursorId(lastItem.id ?? null);
        } else {
          setCursorId(null);
        }

        if (fetched.length < pageSize) {
          setHasMore(false);
        }
      } catch (error) {
        if (generation === generationRef.current) {
          showBottomToast('error', t('toast.refreshError'));
        }
      } finally {
        if (generation === generationRef.current) {
          setRefreshing(false);
        }
      }
    }, [apiCall, defaultParams, pageSize, t]);

    /** [중요] defaultParams가 바뀌었을 때 목록을 처음부터 다시 불러옵니다.
     * 부모 컴포넌트에서 defaultParams를 useMemo로 감싸두었으므로,
     * 실제 검색어나 필터 조건이 변경될 때만 이 useEffect가 실행됩니다.
     */
    useEffect(() => {
      onRefresh();
    }, [defaultParams, onRefresh]);

    const renderFooter = () => {
      if (hasPageError) {
        return (
          <TouchableOpacity
            onPress={retryPage}
            style={{ alignItems: 'center', gap: 4, paddingVertical: 16 }}>
            <CustomText size={12} lineHeight="sm" color="gray/gray500">
              {t('common.loadMoreFailed')}
            </CustomText>
            <CustomText size={12} weight="bold" lineHeight="sm" color="main_color/blue_p">
              {t('common.retry')}
            </CustomText>
          </TouchableOpacity>
        );
      }

      return loading ? (
        <ActivityIndicator color={theme.color['gray/gray300']} style={{ marginVertical: 16 }} />
      ) : (
        <View style={{ marginBottom: 15 }} />
      );
    };

    return (
      <FlatList
        data={data}
        extraData={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={fetchData}
        onEndReachedThreshold={onEndReachedThreshold}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={!loading ? ListEmptyComponent : undefined}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.color['gray/gray300']}
          />
        }
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        {...flatListProps}
      />
    );
  },
);

export default InfiniteScrollList as <T>(
  props: InfiniteScrollListProps<T> & { ref?: React.Ref<InfiniteScrollListRef<T>> },
) => React.ReactElement;
