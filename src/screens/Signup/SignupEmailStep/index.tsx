import React, { useEffect, useState } from 'react';
import { BottomButtonBar, CustomText, CustomTextInput } from '../../../components/common';
import { useTranslation } from 'react-i18next';
import { HelperWrapper, InputWithHelperWrapper, LabelWrapper } from '../index.styles';
import HelperText from '../../../components/common/HelperText';
import { emailRegex } from '../../../utils/validators';
import { updateEmailAuthCode } from '../../../apis/auth';

interface SignupEmailStepProps {
  email: string;
  setEmail: (email: string) => void;
  onNext: () => void;
}

const SignupEmailStep = ({ email, setEmail, onNext }: SignupEmailStepProps) => {
  const { t } = useTranslation();
  const [isEmailValid, setIsEmailValid] = useState<boolean>(false);

  const transition = [
    {
      text: t('button.sendEmail'),
      onAction: async () => {
        handleSendEmail();
      },
      disabled: !isEmailValid,
    },
  ];

  const handleSendEmail = async () => {
    if (isEmailValid) {
      try {
        await updateEmailAuthCode(email);
        onNext();
      } catch (msg) {
        console.error(msg);
      }
    }
  };

  useEffect(() => {
    setIsEmailValid(email !== '' && emailRegex.test(email));
  }, [email]);

  return (
    <>
      <LabelWrapper>
        <CustomText size={18} lineHeight="lg">
          {t('auth.enterEmail.prefix')}
        </CustomText>
        <CustomText size={18} lineHeight="lg" weight="bold">
          {t('auth.enterEmail.title')}
        </CustomText>
      </LabelWrapper>

      <InputWithHelperWrapper>
        <CustomTextInput
          placeholder={t('placeholder.email')}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <HelperWrapper>
          <HelperText type="info">{t('auth.enterEmail.description')}</HelperText>
        </HelperWrapper>
      </InputWithHelperWrapper>

      <BottomButtonBar transitions={transition} />
    </>
  );
};

export default SignupEmailStep;
