/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { ActivityIndicator, FlatList, FlatListProps, View } from 'react-native';
import theme from '../../../styles/theme';
import { showBottomToast } from '../Toast/toastMessage';
import { RefreshControl } from 'react-native-gesture-handler';

export interface ApiCallParams {
  id?: number | null;
  size?: number;
  sort?: 'LATEST' | 'LIKE';
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
  onEndReachedThreshold?: number;
  ListEmptyComponent?: React.ReactElement | null;
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
      onEndReachedThreshold = 0.6,
      ListEmptyComponent,
      ...flatListProps
    },
    ref,
  ) => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [cursorId, setCursorId] = useState<number | null>(null);

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
      if (loading || !hasMore || refreshing) {
        return;
      }

      setLoading(true);
      try {
        const fetched = await apiCall({
          ...defaultParams,
          id: cursorId,
          size: pageSize,
        });

        setData((prev) => [...prev, ...fetched]);
        setHasMore(fetched.length === pageSize);

        if (fetched.length > 0) {
          const lastItem = fetched[fetched.length - 1] as any;
          setCursorId(lastItem.id ?? null);
        }
      } catch (err) {
        showBottomToast('error', '리스트 불러오기 오류'); // TODO: locales
      } finally {
        setLoading(false);
      }
    }, [apiCall, loading, hasMore, refreshing, cursorId, defaultParams, pageSize]);

    const onRefresh = useCallback(async () => {
      setRefreshing(true);
      setHasMore(true);

      try {
        const fetched = await apiCall({
          ...defaultParams,
          id: null,
          size: pageSize,
        });

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
        showBottomToast('error', '새로고침 오류'); // TODO: locales
      } finally {
        setRefreshing(false);
      }
    }, [apiCall, defaultParams, pageSize]);

    /** [중요] defaultParams가 바뀌었을 때 목록을 처음부터 다시 불러옵니다.
     * 부모 컴포넌트에서 defaultParams를 useMemo로 감싸두었으므로,
     * 실제 검색어나 필터 조건이 변경될 때만 이 useEffect가 실행됩니다.
     */
    useEffect(() => {
      onRefresh();
    }, [defaultParams, onRefresh]);

    const renderFooter = () =>
      loading ? (
        <ActivityIndicator color={theme.color['gray/gray300']} style={{ marginVertical: 16 }} />
      ) : (
        <View style={{ marginBottom: 15 }} />
      );

    return (
      <FlatList
        data={data}
        extraData={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={fetchData}
        onEndReachedThreshold={onEndReachedThreshold}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={!loading ? ListEmptyComponent : null}
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
