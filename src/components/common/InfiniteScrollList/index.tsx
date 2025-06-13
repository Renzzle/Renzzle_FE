/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, FlatListProps, View } from 'react-native';

interface InfiniteScrollListProps<T>
  extends Omit<FlatListProps<T>, 'data' | 'renderItem' | 'keyExtractor'> {
  apiCall: (params: { id: number | null; size: number }) => Promise<T[]>;
  renderItem: ({ item }: { item: T }) => React.ReactElement;
  keyExtractor: (item: T, index: number) => string;
  pageSize?: number;
  onEndReachedThreshold?: number;
  ListEmptyComponent?: React.ReactElement | null;
}

const InfiniteScrollList = <T,>({
  apiCall,
  renderItem,
  keyExtractor,
  pageSize = 10,
  onEndReachedThreshold = 0.6,
  ListEmptyComponent,
  ...flatListProps
}: InfiniteScrollListProps<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [id, setId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = useCallback(async () => {
    if (loading || !hasMore) {
      return;
    }

    setLoading(true);
    try {
      const fetched = await apiCall({ id, size: pageSize });
      setData((prev) => [...prev, ...fetched]);
      setHasMore(fetched.length === pageSize);
      if (fetched.length > 0) {
        const last = fetched[fetched.length - 1] as any;
        setId(last.id);
      }
    } catch (err) {
      console.error('InfiniteScrollList fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasMore, id, loading, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
