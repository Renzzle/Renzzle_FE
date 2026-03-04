import React from 'react';
import { Container, ListWrapper } from './index.styles';
import CustomListItem from '../../components/common/CustomListItem';
import { useTranslation } from 'react-i18next';

const Settings = () => {
  const { t } = useTranslation();

  return (
    <Container>
      <ListWrapper>
        <CustomListItem>{t('settings.language')}</CustomListItem>
        <CustomListItem>{t('settings.changeNickname')}</CustomListItem>
        <CustomListItem>{t('settings.removeAds')}</CustomListItem>
        <CustomListItem>{t('settings.privacyPolicy')}</CustomListItem>
        <CustomListItem>{t('settings.termsOfService')}</CustomListItem>
        <CustomListItem>{t('settings.feedback')}</CustomListItem>
        <CustomListItem>{t('settings.deleteAccount')}</CustomListItem>
      </ListWrapper>
    </Container>
  );
};

export default Settings;
