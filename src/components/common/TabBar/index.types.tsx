import { FC } from 'react';
import { ViewProps } from 'react-native';

export type TabItemType = {
  key: string;
  title: string;
  component: FC<ViewProps>;
};
