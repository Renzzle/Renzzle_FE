import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import React from 'react';
import { ProfileContainer, UserNameContainer } from './index.styles';
import CustomText from '../CustomText';
import TagSmall from '../TagSmall';

const CustomDrawerContent = (props: any) => {
  return (
    <DrawerContentScrollView {...props}>
      <ProfileContainer>
        <UserNameContainer>
          <CustomText size={22} weight="bold" lineHeight="lg">isoo</CustomText>
          <TagSmall>상급자</TagSmall>
        </UserNameContainer>
        <CustomText size={12} color="gray/gray500">isoo@gmail.com</CustomText>
      </ProfileContainer>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
