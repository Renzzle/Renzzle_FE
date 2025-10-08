/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import TabBar from '../../components/common/TabBar';
import { ActiveTabContainer, Container } from './index.styles';
import { getPack, purchaseTrainingPack } from '../../apis/training';
import { showBottomToast } from '../../components/common/Toast/toastMessage';
import { ActivityIndicator, FlatList, View } from 'react-native';
import PackCard from '../../components/features/PackCard';
import { TrainingPack } from '../../components/types';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CustomModal } from '../../components/common';
import useModal from '../../hooks/useModal';
import { GameOutcome } from '../../components/types/Ranking';

const TrainingPacks = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const {
    isModalVisible,
    activateModal,
    closePrimarily,
    closeSecondarily,
    category: modalCategory,
  } = useModal();
  const [packs, setPacks] = useState<TrainingPack[]>([]);
  const [currentTab, setCurrentTab] = useState('LOW');
  const [loading, setLoading] = useState(true);
  const [outcome, setOutcome] = useState<GameOutcome>();

  const handlePackClick = (item: TrainingPack) => {
    setOutcome({ price: item.price });
    if (item.locked) {
      activateModal('TRAINING_PACK_PURCHASE', {
        primaryAction: async () => {
          const isSuccess = await handlePurchase(item.id);
          if (isSuccess) {
            showBottomToast('success', '구매가 완료되었습니다.');
            navigation.navigate('TrainingPuzzles', { pack: item });
          } else {
            return;
          }
        },
      });
    } else {
      navigation.navigate('TrainingPuzzles', { pack: item });
    }
  };

  const handlePurchase = async (id: number) => {
    try {
      await purchaseTrainingPack(id);

      return true;
    } catch (error) {
      showBottomToast('error', error as string);
      return false;
    }
  };

  const fetchPackData = async (difficulty: string) => {
    setLoading(true);
    try {
      const data = await getPack(difficulty, 'KO');
      setPacks(data);
    } catch (error) {
      showBottomToast('error', '문제 팩 불러오기 실패: ' + error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackData(currentTab);
  }, [currentTab]);

  const tabs = [
    { key: 'LOW', title: '초급', component: () => null },
    { key: 'MIDDLE', title: '중급', component: () => null },
    { key: 'HIGH', title: '고급', component: () => null },
  ];

  return (
    <Container>
      <TabBar tabs={tabs} currentTab={currentTab} onTabPress={setCurrentTab} />
      <ActiveTabContainer>
        {loading ? (
          <ActivityIndicator style={{ marginVertical: 16 }} />
        ) : (
          <FlatList
            data={packs}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <PackCard
                key={item.id}
                title={item.title}
                author={item.author}
                description={item.description}
                price={item.price}
                totalPuzzleCount={item.totalPuzzleCount}
                solvedPuzzleCount={item.solvedPuzzleCount}
                isLocked={item.locked}
                onPress={() => handlePackClick(item)}
              />
            )}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
        )}
      </ActiveTabContainer>

      <CustomModal
        isVisible={isModalVisible}
        category={modalCategory}
        onPrimaryAction={closePrimarily}
        onSecondaryAction={closeSecondarily}
        gameOutcome={outcome}
      />
    </Container>
  );
};

export default TrainingPacks;
