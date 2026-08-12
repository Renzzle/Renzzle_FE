import React, { useState } from 'react';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { FindPasswordContainer } from './index.styles';
import FindPasswordEmailStep from './FindPasswordEmailStep';
import FindPasswordCodeStep from './FindPasswordCodeStep';
import FindPasswordNewPasswordStep from './FindPasswordNewPasswordStep';
import { resetPassword } from '../../apis/auth';
import { showBottomToast } from '../../components/common/Toast/toastMessage';

enum FindPasswordStep {
  Email,
  Code,
  Password,
}

const FindPassword = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [step, setStep] = useState<FindPasswordStep>(FindPasswordStep.Email);
  const [email, setEmail] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [authVerityToken, setAuthVerityToken] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleResetComplete = async () => {
    if (!email || !authVerityToken || !password) {
      showBottomToast('error', t('toast.missingRequiredFields'));
      setStep(FindPasswordStep.Email);
      return;
    }

    try {
      setIsLoading(true);
      const response = await resetPassword(email, authVerityToken, password);
      if (response?.isSuccess) {
        navigation.goBack();
        showBottomToast('success', t('toast.passwordChanged'));
      } else {
        showBottomToast('error', response?.errorResponse?.message as string);
      }
    } catch (error) {
      showBottomToast('error', error as string);
    }
    setIsLoading(false);
  };

  return (
    <FindPasswordContainer>
      {step === FindPasswordStep.Email && (
        <FindPasswordEmailStep
          email={email}
          setEmail={setEmail}
          onNext={() => setStep(FindPasswordStep.Code)}
        />
      )}
      {step === FindPasswordStep.Code && (
        <FindPasswordCodeStep
          code={code}
          setCode={setCode}
          email={email}
          setAuthVerityToken={setAuthVerityToken}
          onNext={() => setStep(FindPasswordStep.Password)}
        />
      )}
      {step === FindPasswordStep.Password && (
        <FindPasswordNewPasswordStep
          password={password}
          setPassword={setPassword}
          onComplete={handleResetComplete}
          isLoading={isLoading}
        />
      )}
    </FindPasswordContainer>
  );
};

export default FindPassword;
