import React from 'react';
import { Container, StyledTabItem } from './index.styles';
import { TabItemType } from './index.types';
import CustomText from '../CustomText';

interface TabBarProps {
  tabs: TabItemType[];
  currentTab: string;
  onTabPress: (key: string) => void;
}

const TabBar = ({ tabs, currentTab, onTabPress }: TabBarProps) => {
  return (
    <Container>
      {tabs.map((tab) => (
        <StyledTabItem
          key={tab.key}
          onPress={() => onTabPress(tab.key)}
          isSelected={currentTab === tab.key}>
          {currentTab === tab.key ? (
            <CustomText size={14} lineHeight="sm" color="main_color/blue_s" weight="bold">
              {tab.title}
            </CustomText>
          ) : (
            <CustomText size={14} lineHeight="sm" color="gray/gray400">
              {tab.title}
            </CustomText>
          )}
        </StyledTabItem>
      ))}
    </Container>
  );
};

export default TabBar;
