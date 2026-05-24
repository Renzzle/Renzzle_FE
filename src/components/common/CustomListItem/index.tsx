import React from 'react';
import { CardContainer } from './index.styles';

interface ListItemProps {
  children: React.ReactNode;
  onPress?: () => void;
}

const CustomListItem = ({ children, onPress }: ListItemProps) => {
  return <CardContainer onPress={onPress}>{children}</CardContainer>;
};

export default CustomListItem;
