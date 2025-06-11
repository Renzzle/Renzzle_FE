import React from 'react';
import { useTranslation } from 'react-i18next';
import { HelperWrapper, InputWithHelperWrapper, LabelWrapper } from '../index.styles';
import { BottomButtonBar, CustomText, CustomTextInput } from '../../../components/common';
import HelperText from '../../../components/common/HelperText';
import { confirmCode, updateEmailAuthCode } from '../../../apis/auth';

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

  const transition = [
    {
      text: t('button.resend'),
      onAction: async () => {
        handleResend();
      },
      disabled: false,
    },
    {
      text: t('button.confirm'),
      onAction: async () => {
        codeConfirm();
      },
      disabled: code.length === 0,
    },
  ];

  const handleResend = async () => {
    try {
      await updateEmailAuthCode(email);
    } catch (err) {
      console.error(err);
    }
  };

  const codeConfirm = async () => {
    try {
      console.log('hi');
      const response = await confirmCode(email, code);
      const token = response?.response?.authVerityToken;
      if (response?.isSuccess && token) {
        setAuthVerityToken(token);
        onNext();
      } else {
        console.error(response);
      }
    } catch (err) {
      console.error(err);
    }
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
