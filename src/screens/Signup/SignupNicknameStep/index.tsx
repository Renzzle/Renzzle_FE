import React, { useState } from 'react';
import { checkNicknameDuplicate } from '../../../apis/auth';
import { showBottomToast } from '../../../components/common/Toast/toastMessage';
import NicknameInputStep from '../../../components/features/NicknameInputStep';
import { useTranslation } from 'react-i18next';

interface SignupNicknameStepProps {
  nickname: string;
  setNickname: (nickname: string) => void;
  onComplete: () => void;
}

const SignupNicknameStep = ({ nickname, setNickname, onComplete }: SignupNicknameStepProps) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      const response = await checkNicknameDuplicate(nickname);

      if (!response?.response) {
        onComplete();
      } else {
        showBottomToast('error', t('toast.nicknameAlreadyInUse'));
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
