import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BottomButtonBar, CustomText, CustomTextInput } from '../../../components/common';
import HelperText from '../../../components/common/HelperText';
import { emailRegex } from '../../../utils/validators';
import { sendPasswordResetCode } from '../../../apis/auth';
import { showBottomToast } from '../../../components/common/Toast/toastMessage';
import { HelperWrapper, InputWithHelperWrapper, LabelWrapper } from '../../Signup/index.styles';

interface FindPasswordEmailStepProps {
  email: string;
  setEmail: (email: string) => void;
  onNext: () => void;
}

const FindPasswordEmailStep = ({ email, setEmail, onNext }: FindPasswordEmailStepProps) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEmailValid, setIsEmailValid] = useState<boolean>(false);

  const transition = [
    {
      text: t('button.sendEmail'),
      onAction: async () => {
        handleSendEmail();
      },
      disabled: !isEmailValid || isLoading,
    },
  ];

  const handleSendEmail = async () => {
    if (isEmailValid) {
      try {
        setIsLoading(true);
        await sendPasswordResetCode(email);
        onNext();
      } catch (msg) {
        showBottomToast('error', msg as string);
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsEmailValid(email !== '' && emailRegex.test(email));
  }, [email]);

  return (
    <>
      <LabelWrapper>
        <CustomText size={18} lineHeight="lg">
          {t('auth.resetPassword.prefix')}
        </CustomText>
        <CustomText size={18} lineHeight="lg" weight="bold">
          {t('auth.resetPassword.title')}
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
          <HelperText type="info">{t('auth.resetPassword.description')}</HelperText>
        </HelperWrapper>
      </InputWithHelperWrapper>

      <BottomButtonBar transitions={transition} />
    </>
  );
};

export default FindPasswordEmailStep;
