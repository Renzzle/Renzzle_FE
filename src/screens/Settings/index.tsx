import React from 'react';
import { Container, ListWrapper, UserInfoWrapper } from './index.styles';
import CustomListItem from '../../components/common/CustomListItem';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '../../store/useUserStore';
import { CustomModal, CustomText } from '../../components/common';
import { Linking } from 'react-native';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useModal from '../../hooks/useModal';
import { deleteUser } from '../../apis/user';
import { showBottomToast } from '../../components/common/Toast/toastMessage';
import useAuthStore from '../../store/useAuthStore';
import useConfigStore from '../../store/useConfigStore';

const EXTERNAL_URLS = {
  DEFAULT_FEEDBACK: 'https://forms.gle/NTVoFDAxy498yTv17',
  PRIVACY_POLICY: 'https://renzzle.github.io/Renzzle_Policy/privacy-policy.html',
  TERMS_OF_USE: 'https://renzzle.github.io/Renzzle_Policy/terms-of-use.html',
};

const Settings = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const { t } = useTranslation();
  const user = useUserStore((state) => state.user);
  const { feedbackUrl } = useConfigStore();
  const { clearTokens } = useAuthStore();
  const {
    isModalVisible,
    activateModal,
    closePrimarily,
    closeSecondarily,
    category: modalCategory,
  } = useModal();

  const handleRemoveAds = () => {};

  const handleFeedback = async () => {
    const url = feedbackUrl ?? EXTERNAL_URLS.DEFAULT_FEEDBACK;
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) {
        throw new Error('Invalid URL');
      }

      await Linking.openURL(url);
    } catch (e) {
      console.log('피드백 열기 실패:', e);
      showBottomToast('error', '페이지를 열 수 없습니다.'); // TODO: locales 추가
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser();
      await clearTokens();
    } catch (error) {
      showBottomToast('error', '탈퇴에 실패했습니다.'); // TODO: locales
    }
  };

  const handleUserDelete = () => {
    activateModal('USER_DELETE_CONFIRM', {
      primaryAction: handleDelete,
    });
  };

  const menuItems = [
    { label: t('settings.language'), onPress: () => navigation.navigate('Language') },
    { label: t('settings.changeNickname'), onPress: () => navigation.navigate('ChangeNickname') },
    { label: t('settings.removeAds'), onPress: () => handleRemoveAds },
    {
      label: t('settings.privacyPolicy'),
      onPress: () => Linking.openURL(EXTERNAL_URLS.PRIVACY_POLICY),
    },
    {
      label: t('settings.termsOfService'),
      onPress: () => Linking.openURL(EXTERNAL_URLS.TERMS_OF_USE),
    },
    { label: t('settings.feedback'), onPress: handleFeedback },
    { label: t('settings.deleteAccount'), onPress: handleUserDelete },
  ];

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
        {menuItems.map((item, index) => (
          <CustomListItem key={index} onPress={item.onPress}>
            <CustomText size={14} lineHeight="sm">
              {item.label}
            </CustomText>
          </CustomListItem>
        ))}
      </ListWrapper>

      <CustomModal
        isVisible={isModalVisible}
        category={modalCategory}
        onPrimaryAction={closePrimarily}
        onSecondaryAction={closeSecondarily}
      />
    </Container>
  );
};

export default Settings;
