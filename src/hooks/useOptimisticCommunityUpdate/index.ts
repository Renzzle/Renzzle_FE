import { useEffect, useRef } from 'react';
import { ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { InfiniteScrollListRef } from '../../components/common/InfiniteScrollList';
import { CommunityPuzzle, RootStackParamList } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const useOptimisticCommunityUpdate = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<RootStackParamList, 'CommunityPuzzles'>>();

  const listRef = useRef<InfiniteScrollListRef<CommunityPuzzle>>(null);

  useEffect(() => {
    const updatedItem = route.params?.updatedItem;

    if (updatedItem) {
      const { id, likeCount, views, isSolved } = route.params.updatedItem;

      listRef.current?.updateItem(id, (prevItem) => ({
        ...prevItem,
        likeCount: likeCount !== undefined ? likeCount : prevItem.likeCount,
        views: views !== undefined ? views : prevItem.views,
        isSolved: isSolved !== undefined ? isSolved : prevItem.isSolved,
      }));

      navigation.setParams({ updatedItem: null });
    }
  }, [route.params?.updatedItem, navigation]);

  return listRef;
};

export default useOptimisticCommunityUpdate;
