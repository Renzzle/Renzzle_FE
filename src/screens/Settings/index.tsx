import React from 'react';
import { Container, ListWrapper, UserInfoWrapper } from './index.styles';
import CustomListItem from '../../components/common/CustomListItem';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '../../store/useUserStore';
import { CustomText } from '../../components/common';
import { Linking } from 'react-native';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const Settings = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const { t } = useTranslation();
  const user = useUserStore((state) => state.user);

  return (
    <Container>
      <UserInfoWrapper>
        <CustomText size={22} weight="bold">
          {user?.nickname}
        </CustomText>
        <CustomText size={12} color="gray/gray500">
          {user?.email}
        </CustomText>
      </UserInfoWrapper>

      <ListWrapper>
        <CustomListItem onPress={() => navigation.navigate('Language')}>
          <CustomText size={14} lineHeight="sm">
            {t('settings.language')}
          </CustomText>
        </CustomListItem>

        <CustomListItem>
          <CustomText size={14} lineHeight="sm">
            {t('settings.changeNickname')}
          </CustomText>
        </CustomListItem>

        <CustomListItem>
          <CustomText size={14} lineHeight="sm">
            {t('settings.removeAds')}
          </CustomText>
        </CustomListItem>

        <CustomListItem>
          <CustomText size={14} lineHeight="sm">
            {t('settings.privacyPolicy')}
          </CustomText>
        </CustomListItem>

        <CustomListItem>
          <CustomText size={14} lineHeight="sm">
            {t('settings.termsOfService')}
          </CustomText>
        </CustomListItem>

        <CustomListItem onPress={() => Linking.openURL('https://google.com')}>
          {/* TODO: 실제 피드백 구글폼 주소로 변경 필요 */}
          <CustomText size={14} lineHeight="sm">
            {t('settings.feedback')}
          </CustomText>
        </CustomListItem>

        <CustomListItem>
          <CustomText size={14} lineHeight="sm">
            {t('settings.deleteAccount')}
          </CustomText>
        </CustomListItem>
      </ListWrapper>
    </Container>
  );
};

export default Settings;
