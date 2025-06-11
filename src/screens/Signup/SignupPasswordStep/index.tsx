import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HelperWrapper, InputWithHelperWrapper, LabelWrapper } from '../index.styles';
import { BottomButtonBar, CustomText, CustomTextInput } from '../../../components/common';
import HelperText from '../../../components/common/HelperText';
import { passwordRegex } from '../../../utils/validators';

interface SignupPasswordStepProps {
  password: string;
  setPassword: (password: string) => void;
  onNext: () => void;
}

const SignupPasswordStep = ({ password, setPassword, onNext }: SignupPasswordStepProps) => {
  const { t } = useTranslation();
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);

  const transition = [
    {
      text: t('button.confirm'),
      onAction: async () => {
        handlePasswordConfirm();
      },
      disabled: !isPasswordValid,
    },
  ];

  const handlePasswordConfirm = () => {
    if (isPasswordValid) {
      onNext();
    }
  };

  useEffect(() => {
    if (passwordRegex.test(password) && confirmPassword === password && confirmPassword !== '') {
      setIsPasswordValid(true);
    } else {
      setIsPasswordValid(false);
    }
  }, [password, confirmPassword]);

  const passwordHelper = () => {
    if (password === '') {
      return <HelperText type="info">{t('auth.enterPassword.description')}</HelperText>;
    }
    if (passwordRegex.test(password)) {
      return <HelperText type="checked">{t('auth.enterPassword.description')}</HelperText>;
    } else {
      return <HelperText type="error">{t('auth.enterPassword.description')}</HelperText>;
    }
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
          {t('auth.enterPassword.prefix')}
        </CustomText>
        <CustomText size={18} lineHeight="lg" weight="bold">
          {t('auth.enterPassword.title')}
        </CustomText>
      </LabelWrapper>

      <InputWithHelperWrapper>
        <CustomTextInput
          placeholder={t('placeholder.password')}
          value={password}
          onChangeText={setPassword}
          isPassword
        />
        <HelperWrapper>{passwordHelper()}</HelperWrapper>
      </InputWithHelperWrapper>

      <InputWithHelperWrapper>
        <CustomTextInput
          placeholder={t('placeholder.confirmPassword')}
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

export default SignupPasswordStep;
