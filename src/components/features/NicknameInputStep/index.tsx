import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BottomButtonBar, CustomText, CustomTextInput } from '../../../components/common';
import HelperText from '../../../components/common/HelperText';
import { nicknameRegex } from '../../../utils/validators';
import {
  HelperWrapper,
  InputWithHelperWrapper,
  LabelWrapper,
} from '../../../screens/Signup/index.styles';

interface NicknameInputStepProps {
  nickname: string;
  setNickname: (nickname: string) => void;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
}

const NicknameInputStep = ({
  nickname,
  setNickname,
  onConfirm,
  isLoading = false,
}: NicknameInputStepProps) => {
  const { t } = useTranslation();
  const [isNicknameValid, setIsNicknameValid] = useState(false);

  useEffect(() => {
    setIsNicknameValid(nicknameRegex.test(nickname));
  }, [nickname]);

  const transition = [
    {
      text: t('button.confirm'),
      onAction: onConfirm,
      disabled: !isNicknameValid || isLoading,
    },
  ];

  const nicknameHelper = () => {
    if (nickname === '') {
      return <HelperText type="info">{t('auth.enterNickname.description')}</HelperText>;
    }
    if (nicknameRegex.test(nickname)) {
      return <HelperText type="checked">{t('auth.enterNickname.description')}</HelperText>;
    }
    return <HelperText type="error">{t('auth.enterNickname.description')}</HelperText>;
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

export default NicknameInputStep;
