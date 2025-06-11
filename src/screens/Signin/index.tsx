import React, { useState } from 'react';
import CustomTextInput from '../../components/common/CustomTextInput';
import useAuthStore from '../../store/useAuthStore';
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

const Signin = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [password, setPassword] = useState<string>(''); //login용

  const { signin } = useAuthStore();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const handleLogin = async () => {
    if (!email) {
      return;
    }

    try {
      setLoading(true);
      await signin(email, password);
      setLoading(false);

      navigation.navigate('Home');
    } catch (error) {
      setLoading(false);
      console.error('문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
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
