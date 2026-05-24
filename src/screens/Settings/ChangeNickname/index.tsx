import React, { useState } from 'react';
import NicknameInputStep from '../../../components/features/NicknameInputStep';
import { checkNicknameDuplicate } from '../../../apis/auth';
import { showBottomToast } from '../../../components/common/Toast/toastMessage';
import { CustomModal } from '../../../components/common';
import useModal from '../../../hooks/useModal';
import { Container } from './index.styles';
import { updateUserNickname } from '../../../apis/user';
import { useUserStore } from '../../../store/useUserStore';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

const ChangeNickname = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const {
    isModalVisible,
    activateModal,
    closePrimarily,
    closeSecondarily,
    category: modalCategory,
  } = useModal();
  const { updateUser } = useUserStore();
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);

      const response = await checkNicknameDuplicate(nickname);

      if (!response?.response) {
        activateModal('NICKNAME_CHANGE_PURCHASE', {
          primaryAction: handleNicknameChange,
        });
      } else {
        showBottomToast('error', t('toast.nicknameAlreadyInUse'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNicknameChange = async () => {
    try {
      setIsLoading(true);

      await updateUserNickname(nickname);
      navigation.goBack();
      showBottomToast('success', t('toast.nicknameChanged'));
    } catch (error) {
      showBottomToast('error', t('toast.nicknameChangeFailed'));
    } finally {
      setIsLoading(false);
      await updateUser();
    }
  };

  return (
    <Container>
      <NicknameInputStep
        nickname={nickname}
        setNickname={setNickname}
        onConfirm={handleConfirm}
        isLoading={isLoading}
      />
      <CustomModal
        isVisible={isModalVisible}
        category={modalCategory}
        onPrimaryAction={closePrimarily}
        onSecondaryAction={closeSecondarily}
        gameOutcome={{ price: 2500 }}
        isLoading={isLoading}
      />
    </Container>
  );
};

export default ChangeNickname;
