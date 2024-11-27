/* eslint-disable react-hooks/exhaustive-deps */
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import { ProfileContainer, UserNameContainer } from './index.styles';
import CustomText from '../CustomText';
import TagSmall from '../TagSmall';
import useAuthStore from '../../../store/useAuthStore';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getUser } from '../../../apis/user';
import { UserInfo } from '../../features/User/index.types';

const CustomDrawerContent = (props: any) => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const {accessToken} = useAuthStore();
  const [user, setUser] = useState<UserInfo>();

  useEffect(() => {
    const loadUserInfo = async () => {
      if (accessToken === undefined) {
        navigation.navigate('Signin');
      } else {
        try {
          const data = await getUser(accessToken);
          setUser(data);
        } catch (error) {
          throw error;
        }
      }
    };
    loadUserInfo();
  }, []);

  return (
    <DrawerContentScrollView {...props}>
      <ProfileContainer>
        <UserNameContainer>
          <CustomText size={22} weight="bold" lineHeight="lg"> {user && user.nickname} </CustomText>
          <TagSmall> {user && user.level} </TagSmall>
        </UserNameContainer>
        <CustomText size={12} color="gray/gray500"> {user && user.email} </CustomText>
      </ProfileContainer>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
