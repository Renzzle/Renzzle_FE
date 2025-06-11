import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HelperWrapper, InputWithHelperWrapper, LabelWrapper } from '../index.styles';
import { BottomButtonBar, CustomText, CustomTextInput } from '../../../components/common';
import HelperText from '../../../components/common/HelperText';
import { nicknameRegex } from '../../../utils/validators';
import { checkNicknameDuplicate } from '../../../apis/auth';
import { showBottomToast } from '../../../components/common/Toast/toastMessage';

interface SignupNicknameStepProps {
  nickname: string;
  setNickname: (nickname: string) => void;
  onComplete: () => void;
}

const SignupNicknameStep = ({ nickname, setNickname, onComplete }: SignupNicknameStepProps) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isNicknameValid, setIsNicknameValid] = useState<boolean>(false);

  const transition = [
    {
      text: t('button.confirm'),
      onAction: async () => {
        handleNicknameConfirm();
      },
      disabled: !isNicknameValid || isLoading,
    },
  ];

  const handleNicknameConfirm = async () => {
    try {
      setIsLoading(true);
      const response = await checkNicknameDuplicate(nickname);

      if (!response?.response) {
        onComplete();
      } else {
        showBottomToast('error', '이미 사용된 닉네임입니다.');
      }
    } catch (error) {
      showBottomToast('error', error as string);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (nicknameRegex.test(nickname)) {
      setIsNicknameValid(true);
    } else {
      setIsNicknameValid(false);
    }
  }, [nickname]);

  const nicknameHelper = () => {
    if (nickname === '') {
      return <HelperText type="info">{t('auth.enterNickname.description')}</HelperText>;
    }
    if (nicknameRegex.test(nickname)) {
      return <HelperText type="checked">{t('auth.enterNickname.description')}</HelperText>;
    } else {
      return <HelperText type="error">{t('auth.enterNickname.description')}</HelperText>;
    }
  };

  return (
    <>
      <LabelWrapper>
        <CustomText size={18} lineHeight="lg">
          {t('auth.enterNickname.prefix')}
        </CustomText>
        <CustomText size={18} lineHeight="lg" weight="bold">
          {t('auth.enterNickname.title')}
        </CustomText>
      </LabelWrapper>

      <InputWithHelperWrapper>
        <CustomTextInput
          placeholder={t('placeholder.nickname')}
          value={nickname}
          onChangeText={setNickname}
        />
        <HelperWrapper>{nicknameHelper()}</HelperWrapper>
      </InputWithHelperWrapper>

      <BottomButtonBar transitions={transition} />
    </>
  );
};

export default SignupNicknameStep;
