/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import TabBar from '../../components/common/TabBar';
import { ActiveTabContainer, Container } from './index.styles';
import { getPack, purchaseTrainingPack } from '../../apis/training';
import { showBottomToast } from '../../components/common/Toast/toastMessage';
import { ActivityIndicator, FlatList, View } from 'react-native';
import PackCard from '../../components/features/PackCard';
import { ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CustomModal } from '../../components/common';
import useModal from '../../hooks/useModal';
import { GameOutcome, RootStackParamList, TrainingPack } from '../../types';
import { useUserStore } from '../../store/useUserStore';
import theme from '../../styles/theme';
import { useTranslation } from 'react-i18next';

const TrainingPacks = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<RootStackParamList, 'TrainingPacks'>>();
  const {
    isModalVisible,
    activateModal,
    closePrimarily,
    closeSecondarily,
    category: modalCategory,
  } = useModal();
  const { updateUser } = useUserStore();
  const [packs, setPacks] = useState<TrainingPack[]>([]);
  const [currentTab, setCurrentTab] = useState('LOW');
  const [loading, setLoading] = useState(true);
  const [outcome, setOutcome] = useState<GameOutcome>();
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  const handlePackClick = (item: TrainingPack) => {
    console.log(item);
    setOutcome({ price: item.price, puzzleCount: item.totalPuzzleCount });
    if (item.locked) {
      activateModal('TRAINING_PACK_PURCHASE', {
        primaryAction: async () => {
          setPurchaseLoading(true);
          const isSuccess = await handlePurchase(item.id);
          if (isSuccess) {
            await updateUser();
            showBottomToast('success', t('toast.purchaseComplete'));
            navigation.navigate('TrainingPuzzles', { pack: item });
          } else {
            return;
          }
          setPurchaseLoading(false);
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

  // Fetch data on initial mount
  useEffect(() => {
    const fetchPackData = async (difficulty: string) => {
      setLoading(true);
      try {
        const data = await getPack(difficulty, 'KO');
        setPacks(data);
      } catch (error) {
        showBottomToast('error', t('toast.trainingPackLoadFailed') + error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackData(currentTab);
  }, [currentTab, t]);

  // Optimistic update
  useEffect(() => {
    const updatedPack = route.params?.updatedPack;

    if (updatedPack) {
      setPacks((prevPacks) =>
        prevPacks.map((prevPack) => (prevPack.id === updatedPack.id ? updatedPack : prevPack)),
      );

      navigation.setParams({ updatedPack: undefined });
    }
  }, [route.params?.updatedPack, navigation]);

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
          <ActivityIndicator color={theme.color['gray/gray300']} style={{ marginVertical: 16 }} />
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
        isLoading={purchaseLoading}
      />
    </Container>
  );
};

export default TrainingPacks;
