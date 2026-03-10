import React from 'react';
import { Container, ListWrapper, UserInfoWrapper } from './index.styles';
import CustomListItem from '../../components/common/CustomListItem';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '../../store/useUserStore';
import { CustomText } from '../../components/common';
import { Linking } from 'react-native';

const Settings = () => {
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
        <CustomListItem>{t('settings.language')}</CustomListItem>
        <CustomListItem>{t('settings.changeNickname')}</CustomListItem>
        <CustomListItem>{t('settings.removeAds')}</CustomListItem>
        <CustomListItem>{t('settings.privacyPolicy')}</CustomListItem>
        <CustomListItem>{t('settings.termsOfService')}</CustomListItem>
        <CustomListItem onPress={() => Linking.openURL('https://google.com')}>
          {/* TODO: 실제 피드백 구글폼 주소로 변경 필요 */}
          {t('settings.feedback')}
        </CustomListItem>
        <CustomListItem>{t('settings.deleteAccount')}</CustomListItem>
      </ListWrapper>
    </Container>
  );
};

export default Settings;
