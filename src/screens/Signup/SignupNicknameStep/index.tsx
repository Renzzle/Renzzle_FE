import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HelperWrapper, InputWithHelperWrapper, LabelWrapper } from '../index.styles';
import { BottomButtonBar, CustomText, CustomTextInput } from '../../../components/common';
import HelperText from '../../../components/common/HelperText';
import { nicknameRegex } from '../../../utils/validators';
import { checkNicknameDuplicate } from '../../../apis/auth';

interface SignupNicknameStepProps {
  nickname: string;
  setNickname: (nickname: string) => void;
  onComplete: () => void;
}

const SignupNicknameStep = ({ nickname, setNickname, onComplete }: SignupNicknameStepProps) => {
  const { t } = useTranslation();
  const [isNicknameValid, setIsNicknameValid] = useState<boolean>(false);

  const transition = [
    {
      text: t('button.confirm'),
      onAction: async () => {
        handleNicknameConfirm();
      },
      disabled: !isNicknameValid,
    },
  ];

  const handleNicknameConfirm = async () => {
    try {
      const response = await checkNicknameDuplicate(nickname);

      if (!response?.response) {
        onComplete();
      } else {
        // TODO: 닉네임 중복 다이얼로그
        console.error('닉네임 중복!!!');
      }
    } catch (err) {
      console.error(err);
    }
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
