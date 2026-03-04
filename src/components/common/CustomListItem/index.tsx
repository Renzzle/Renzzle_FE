import React from 'react';
import { CardContainer } from './index.styles';
import { CustomText } from '..';

interface ListItemProps {
  children: React.ReactNode;
  onPress?: () => {};
}

const CustomListItem = ({ children, onPress }: ListItemProps) => {
  return (
    <CardContainer onPress={onPress}>
      <CustomText size={14} lineHeight="sm">
        {children}
      </CustomText>
    </CardContainer>
  );
};

export default CustomListItem;
