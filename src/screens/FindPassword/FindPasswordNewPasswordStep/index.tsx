import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BottomButtonBar, CustomText, CustomTextInput } from '../../../components/common';
import HelperText from '../../../components/common/HelperText';
import { passwordRegex } from '../../../utils/validators';
import { HelperWrapper, InputWithHelperWrapper, LabelWrapper } from '../../Signup/index.styles';

interface FindPasswordNewPasswordStepProps {
  password: string;
  setPassword: (password: string) => void;
  onComplete: () => Promise<void>;
  isLoading?: boolean;
}

const FindPasswordNewPasswordStep = ({
  password,
  setPassword,
  onComplete,
  isLoading = false,
}: FindPasswordNewPasswordStepProps) => {
  const { t } = useTranslation();
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);

  const transition = [
    {
      text: t('button.confirm'),
      onAction: onComplete,
      disabled: !isPasswordValid || isLoading,
    },
  ];

  useEffect(() => {
    setIsPasswordValid(
      passwordRegex.test(password) && confirmPassword === password && confirmPassword !== '',
    );
  }, [password, confirmPassword]);

  const passwordHelper = () => {
    if (password === '') {
      return <HelperText type="info">{t('auth.enterPassword.description')}</HelperText>;
    }
    if (passwordRegex.test(password)) {
      return <HelperText type="checked">{t('auth.enterPassword.description')}</HelperText>;
    }
    return <HelperText type="error">{t('auth.enterPassword.description')}</HelperText>;
  };

  const confirmPasswordHelper = () => {
    if (confirmPassword === '' || !passwordRegex.test(password)) {
      return null;
    }
    if (confirmPassword === password) {
      return <HelperText type="checked">{t('auth.enterPassword.passwordMatch')}</HelperText>;
    }
    return <HelperText type="error">{t('auth.enterPassword.passwordMisMatch')}</HelperText>;
  };

  return (
    <>
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
          placeholder={t('placeholder.newPassword')}
          value={password}
          onChangeText={setPassword}
          isPassword
        />
        <HelperWrapper>{passwordHelper()}</HelperWrapper>
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
    </>
  );
};

export default FindPasswordNewPasswordStep;
