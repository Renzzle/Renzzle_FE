import React, { useState } from 'react';
import { checkNicknameDuplicate } from '../../../apis/auth';
import { showBottomToast } from '../../../components/common/Toast/toastMessage';
import NicknameInputStep from '../../../components/features/NicknameInputStep';

interface SignupNicknameStepProps {
  nickname: string;
  setNickname: (nickname: string) => void;
  onComplete: () => void;
}

const SignupNicknameStep = ({ nickname, setNickname, onComplete }: SignupNicknameStepProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      const response = await checkNicknameDuplicate(nickname);

      if (!response?.response) {
        onComplete();
      } else {
        showBottomToast('error', '이미 사용된 닉네임입니다.'); // TODO: locales
      }
    } catch (error) {
      showBottomToast('error', error as string);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <NicknameInputStep
      nickname={nickname}
      setNickname={setNickname}
      onConfirm={handleConfirm}
      isLoading={isLoading}
    />
  );
};

export default SignupNicknameStep;
