import React, { useState } from 'react';
import CustomTextInput from '../../components/common/CustomTextInput';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  LogoWrapper,
  NavigationButton,
  NavigationWrapper,
  SigninContainer,
  SigninWrapper,
  TextInputContainer,
} from './index.styles';
import BottomButtonBar from '../../components/common/BottomButtonBar';
import CustomText from '../../components/common/CustomText';
import { useTranslation } from 'react-i18next';
import { Icon } from '../../components/common';
import { showBottomToast } from '../../components/common/Toast/toastMessage';
import { useLogin } from '../../hooks/useLogin';

const Signin = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [password, setPassword] = useState<string>(''); //login용

  const { login } = useLogin();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const handleLogin = async () => {
    if (!email) {
      showBottomToast('error', '이메일을 입력해주세요.');
      return;
    }
    if (!password) {
      showBottomToast('error', '비밀번호를 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);

      navigation.navigate('Home');
    } catch (error) {
      showBottomToast('error', error as string);
    }
    setLoading(false);
  };

  const transition = [
    {
      text: t('auth.signin'),
      onAction: async () => {
        handleLogin();
      },
      disabled: loading,
    },
  ];

  return (
    <SigninContainer>
      <SigninWrapper>
        <LogoWrapper>
          <Icon name="LogoIcon" color="main_color/blue_p" />
          <Icon name="LogoTextIcon" color="main_color/blue_p" />
        </LogoWrapper>

        <TextInputContainer>
          <CustomTextInput
            placeholder={t('placeholder.email')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <CustomTextInput
            placeholder={t('placeholder.password')}
            value={password}
            onChangeText={setPassword}
            isPassword
          />
        </TextInputContainer>

        <NavigationWrapper>
          <NavigationButton
            onPress={() => {
              navigation.navigate('Signup');
            }}>
            <CustomText size={12} lineHeight="sm" color="gray/gray500">
              {t('auth.signup')}
            </CustomText>
          </NavigationButton>
          <NavigationButton>
            <CustomText size={12} lineHeight="sm" color="gray/gray500">
              {t('auth.findPassword')}
            </CustomText>
          </NavigationButton>
        </NavigationWrapper>
      </SigninWrapper>

      <BottomButtonBar transitions={transition} />
    </SigninContainer>
  );
};

export default Signin;
