import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomButtonBar, CustomText, CustomTextInput } from '../../../components/common';
import HelperText from '../../../components/common/HelperText';
import { showBottomToast } from '../../../components/common/Toast/toastMessage';
import { changePassword } from '../../../apis/auth';
import { passwordRegex } from '../../../utils/validators';
import { HelperWrapper, InputWithHelperWrapper, LabelWrapper } from '../../Signup/index.styles';
import { Container } from './index.styles';

const ChangePassword = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsFormValid(
      currentPassword !== '' &&
        passwordRegex.test(newPassword) &&
        confirmPassword === newPassword &&
        confirmPassword !== '',
    );
  }, [currentPassword, newPassword, confirmPassword]);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await changePassword(currentPassword, newPassword);
      navigation.goBack();
      showBottomToast('success', t('toast.passwordChanged'));
    } catch (error) {
      showBottomToast('error', t('toast.passwordChangeFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const transition = [
    {
      text: t('button.confirm'),
      onAction: handleConfirm,
      disabled: !isFormValid || isLoading,
    },
  ];

  const newPasswordHelper = () => {
    if (newPassword === '') {
      return <HelperText type="info">{t('auth.enterPassword.description')}</HelperText>;
    }
    if (passwordRegex.test(newPassword)) {
      return <HelperText type="checked">{t('auth.enterPassword.description')}</HelperText>;
    }
    return <HelperText type="error">{t('auth.enterPassword.description')}</HelperText>;
  };

  const confirmPasswordHelper = () => {
    if (confirmPassword === '' || !passwordRegex.test(newPassword)) {
      return null;
    }
    if (confirmPassword === newPassword) {
      return <HelperText type="checked">{t('auth.enterPassword.passwordMatch')}</HelperText>;
    }
    return <HelperText type="error">{t('auth.enterPassword.passwordMisMatch')}</HelperText>;
  };

  return (
    <Container>
      <LabelWrapper>
        <CustomText size={18} lineHeight="lg">
          {t('auth.changePassword.prefix')}
        </CustomText>
        <CustomText size={18} lineHeight="lg" weight="bold">
          {t('auth.changePassword.title')}
        </CustomText>
      </LabelWrapper>

      <InputWithHelperWrapper>
        <CustomTextInput
          placeholder={t('placeholder.currentPassword')}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          isPassword
        />
        <HelperWrapper />
      </InputWithHelperWrapper>

      <InputWithHelperWrapper>
        <CustomTextInput
          placeholder={t('placeholder.newPassword')}
          value={newPassword}
          onChangeText={setNewPassword}
          isPassword
        />
        <HelperWrapper>{newPasswordHelper()}</HelperWrapper>
      </InputWithHelperWrapper>

      <InputWithHelperWrapper>
        <CustomTextInput
          placeholder={t('placeholder.confirmNewPassword')}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          isPassword
        />
        <HelperWrapper>{confirmPasswordHelper()}</HelperWrapper>
      </InputWithHelperWrapper>

      <BottomButtonBar transitions={transition} />
    </Container>
  );
};

export default ChangePassword;
