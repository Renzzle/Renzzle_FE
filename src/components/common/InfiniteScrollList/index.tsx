/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, FlatListProps, View } from 'react-native';

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

const InfiniteScrollList = <T,>({
  apiCall,
  renderItem,
  keyExtractor,
  pageSize = 10,
  defaultParams,
  onEndReachedThreshold = 0.6,
  ListEmptyComponent,
  ...flatListProps
}: InfiniteScrollListProps<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursorId, setCursorId] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    if (loading || !hasMore) {
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
        const last = fetched[fetched.length - 1] as any;
        setCursorId(last.id ?? null);
      }
    } catch (err) {
      console.error('InfiniteScrollList fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [apiCall, cursorId, defaultParams, hasMore, loading, pageSize]);

  useEffect(() => {
    setData([]);
    setHasMore(true);
    setCursorId(null);
  }, [defaultParams, pageSize]);

  useEffect(() => {
    if (cursorId === null) {
      fetchData();
    }
  }, [cursorId, fetchData]);

  const renderFooter = () =>
    loading ? (
      <ActivityIndicator style={{ marginVertical: 16 }} />
    ) : (
      <View style={{ marginBottom: 15 }} />
    );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReached={fetchData}
      onEndReachedThreshold={onEndReachedThreshold}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={!loading ? ListEmptyComponent : null}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      {...flatListProps}
    />
  );
};

export default InfiniteScrollList;
