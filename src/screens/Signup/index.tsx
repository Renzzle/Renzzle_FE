import React, { useEffect, useState } from 'react';
import { SignupContainer } from './index.styles';
import SignupEmailStep from './SignupEmailStep';
import SignupCodeStep from './SignupCodeStep';
import SignupPasswordStep from './SignupPasswordStep';
import SignupNicknameStep from './SignupNicknameStep';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DeviceInfo from 'react-native-device-info';
import { registerUser } from '../../apis/auth';
import { showBottomToast } from '../../components/common/Toast/toastMessage';
import { useLogin } from '../../hooks/useLogin';

enum SignupStep {
  Email,
  Code,
  Password,
  Nickname,
}

const Signup = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const { login } = useLogin();
  const [step, setStep] = useState<SignupStep>(SignupStep.Email);
  const [email, setEmail] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [authVerityToken, setAuthVerityToken] = useState<string>('');
  const [deviceId, setDeviceId] = useState<string>('');

  const handleSignupComplete = async () => {
    if (!email || !code || !password || !nickname || !authVerityToken || !deviceId) {
      showBottomToast('error', '필수 항목이 누락되었습니다. 처음으로 돌아갑니다.');
      fetchDeviceId();
      setStep(SignupStep.Email);
      return;
    }

    try {
      const response = await registerUser(email, password, nickname, authVerityToken, deviceId);
      if (response?.isSuccess) {
        await login(email, password);
        navigation.navigate('Home');
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
