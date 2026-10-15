import React, { useEffect, useState } from 'react';
import { SignupContainer } from './index.styles';
import SignupEmailStep from './SignupEmailStep';
import SignupCodeStep from './SignupCodeStep';
import SignupPasswordStep from './SignupPasswordStep';
import SignupNicknameStep from './SignupNicknameStep';
import DeviceInfo from 'react-native-device-info';
import { registerUser } from '../../apis/auth';
import { showBottomToast } from '../../components/common/Toast/toastMessage';
import { useLogin } from '../../hooks/useLogin';
import { useTranslation } from 'react-i18next';
import useTutorialStore from '../../store/useTutorialStore';

enum SignupStep {
  Email,
  Code,
  Password,
  Nickname,
}

const Signup = () => {
  const { t } = useTranslation();
  const { login } = useLogin();
  const setTutorialPending = useTutorialStore((state) => state.setTutorialPending);
  const [step, setStep] = useState<SignupStep>(SignupStep.Email);
  const [email, setEmail] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [authVerityToken, setAuthVerityToken] = useState<string>('');
  const [deviceId, setDeviceId] = useState<string>('');

  const handleSignupComplete = async () => {
    if (!email || !code || !password || !nickname || !authVerityToken || !deviceId) {
      showBottomToast('error', t('toast.missingRequiredFields'));
      fetchDeviceId();
      setStep(SignupStep.Email);
      return;
    }

    try {
      const response = await registerUser(email, password, nickname, authVerityToken, deviceId);
      if (response?.isSuccess) {
        // 로그인되면 인증 스택으로 바뀌며 Home이 바로 뜨므로, 그 전에 튜토리얼 표시 여부를 저장해 둔다.
        // (Home으로 직접 이동하면 Home이 띄운 튜토리얼 화면이 닫히므로 별도로 이동하지 않는다)
        await setTutorialPending(true);
        await login(email, password);
      }
    } catch (error) {
      showBottomToast('error', error as string);
    }
  };

  const fetchDeviceId = async () => {
    const id = await DeviceInfo.getUniqueId();
    setDeviceId(id);
  };

  useEffect(() => {
    fetchDeviceId();
  }, []);

  return (
    <SignupContainer>
      {step === SignupStep.Email && (
        <SignupEmailStep
          email={email}
          setEmail={setEmail}
          onNext={() => setStep(SignupStep.Code)}
        />
      )}
      {step === SignupStep.Code && (
        <SignupCodeStep
          code={code}
          setCode={setCode}
          email={email}
          setAuthVerityToken={setAuthVerityToken}
          onNext={() => setStep(SignupStep.Password)}
        />
      )}
      {step === SignupStep.Password && (
        <SignupPasswordStep
          password={password}
          setPassword={setPassword}
          onNext={() => setStep(SignupStep.Nickname)}
        />
      )}
      {step === SignupStep.Nickname && (
        <SignupNicknameStep
          nickname={nickname}
          setNickname={setNickname}
          onComplete={handleSignupComplete}
        />
      )}
    </SignupContainer>
  );
};

export default Signup;
