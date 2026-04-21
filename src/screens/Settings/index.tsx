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

const Settings = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const { t } = useTranslation();
  const DEFAULT_FEEDBACK_URL = 'https://forms.gle/NTVoFDAxy498yTv17';
  const { feedbackUrl } = useConfigStore();
  const { clearTokens } = useAuthStore();
  const {
    isModalVisible,
    activateModal,
    closePrimarily,
    closeSecondarily,
    category: modalCategory,
  } = useModal();
  const user = useUserStore((state) => state.user);

  const handleFeedback = async () => {
    const url = feedbackUrl ?? DEFAULT_FEEDBACK_URL;
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

  const handleUserDelete = () => {
    activateModal('USER_DELETE_CONFIRM', {
      primaryAction: handleDelete,
    });
  };

  const handleDelete = async () => {
    try {
      await deleteUser();
      await clearTokens();
    } catch (error) {
      showBottomToast('error', '탈퇴에 실패했습니다.');
    }
  };

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

        <CustomListItem onPress={() => navigation.navigate('ChangeNickname')}>
          <CustomText size={14} lineHeight="sm">
            {t('settings.changeNickname')}
          </CustomText>
        </CustomListItem>

        <CustomListItem>
          <CustomText size={14} lineHeight="sm">
            {t('settings.removeAds')}
          </CustomText>
        </CustomListItem>

        <CustomListItem
          onPress={() =>
            Linking.openURL('https://renzzle.github.io/Renzzle_Policy/privacy-policy.html')
          }>
          <CustomText size={14} lineHeight="sm">
            {t('settings.privacyPolicy')}
          </CustomText>
        </CustomListItem>

        <CustomListItem
          onPress={() =>
            Linking.openURL('https://renzzle.github.io/Renzzle_Policy/terms-of-use.html')
          }>
          <CustomText size={14} lineHeight="sm">
            {t('settings.termsOfService')}
          </CustomText>
        </CustomListItem>

        <CustomListItem onPress={handleFeedback}>
          <CustomText size={14} lineHeight="sm">
            {t('settings.feedback')}
          </CustomText>
        </CustomListItem>

        <CustomListItem onPress={handleUserDelete}>
          <CustomText size={14} lineHeight="sm">
            {t('settings.deleteAccount')}
          </CustomText>
        </CustomListItem>
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
