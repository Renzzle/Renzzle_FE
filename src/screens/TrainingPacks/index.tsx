/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import TabBar from '../../components/common/TabBar';
import { ActiveTabContainer, Container } from './index.styles';
import { getPack } from '../../apis/training';
import { showBottomToast } from '../../components/common/Toast/toastMessage';
import { ActivityIndicator } from 'react-native';
import PackCard from '../../components/features/PackCard';
import { TrainingPack } from '../../components/types';

const TrainingPacks = () => {
  const [packs, setPacks] = useState<TrainingPack[]>([]);
  const [currentTab, setCurrentTab] = useState('LOW');
  const [loading, setLoading] = useState(true);

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
          packs.map((pack) => (
            <PackCard
              key={pack.id}
              title={pack.title}
              author={pack.author}
              description={pack.description}
              price={pack.price}
              totalPuzzleCount={pack.totalPuzzleCount}
              solvedPuzzleCount={pack.solvedPuzzleCount}
              isLocked={pack.locked}
              onPress={() => {}}
            />
          ))
        )}
      </ActiveTabContainer>
    </Container>
  );
};

export default TrainingPacks;
