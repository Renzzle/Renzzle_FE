import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HelperWrapper, InputWithHelperWrapper, LabelWrapper } from '../index.styles';
import { BottomButtonBar, CustomText, CustomTextInput } from '../../../components/common';
import HelperText from '../../../components/common/HelperText';
import { confirmCode, updateEmailAuthCode } from '../../../apis/auth';
import { showBottomToast } from '../../../components/common/Toast/toastMessage';

interface SignupCodeStepProps {
  code: string;
  setCode: (code: string) => void;
  email: string;
  setAuthVerityToken: (authVerityToken: string) => void;
  onNext: () => void;
}

const SignupCodeStep = ({
  code,
  setCode,
  email,
  setAuthVerityToken,
  onNext,
}: SignupCodeStepProps) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const transition = [
    {
      text: t('button.resend'),
      onAction: async () => {
        handleResend();
      },
      disabled: isLoading,
    },
    {
      text: t('button.confirm'),
      onAction: async () => {
        codeConfirm();
      },
      disabled: code.length === 0 || isLoading,
    },
  ];

  const handleResend = async () => {
    try {
      setIsLoading(true);
      await updateEmailAuthCode(email);
    } catch (error) {
      showBottomToast('error', error as string);
    }
    setIsLoading(false);
  };

  const codeConfirm = async () => {
    try {
      setIsLoading(true);
      const response = await confirmCode(email, code);
      const token = response?.response?.authVerityToken;
      if (response?.isSuccess && token) {
        setAuthVerityToken(token);
        onNext();
      } else {
        showBottomToast('error', response?.errorResponse?.message as string);
      }
    } catch (error) {
      showBottomToast('error', error as string);
    }
    setIsLoading(false);
  };

  return (
    <>
      <LabelWrapper>
        <CustomText size={18} lineHeight="lg">
          {t('auth.enterCode.prefix')}
        </CustomText>
        <CustomText size={18} lineHeight="lg" weight="bold">
          {t('auth.enterCode.title')}
        </CustomText>
      </LabelWrapper>

      <InputWithHelperWrapper>
        <CustomTextInput
          placeholder={t('placeholder.code')}
          value={code}
          onChangeText={setCode}
          keyboardType="numeric"
        />
        <HelperWrapper>
          <HelperText type="info">{t('auth.enterCode.description')}</HelperText>
        </HelperWrapper>
      </InputWithHelperWrapper>

      <BottomButtonBar transitions={transition} />
    </>
  );
};

export default SignupCodeStep;
