import React, { useState } from 'react';
import CustomTextInput from '../../components/common/CustomTextInput';
import useAuthStore from '../../store/useAuthStore';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SigninContainer, SigninInfoContainer, TextInputContainer } from './index.styles';
import BottomButtonBar from '../../components/common/BottomButtonBar';
import CustomText from '../../components/common/CustomText';

const Signin = () => {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [password, setPassword] = useState<string>(''); //login용

  const { signin } = useAuthStore();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const handleLogin = async () => {
    if (!email) {return;}

    try {
      setLoading(true);
      await signin(email, password);
      setLoading(false);

      navigation.navigate('Home');
    } catch (error) {
      setLoading(false);
      alert('Error');
    }
  };

  const transition = [
    {
      text: '로그인',
      onAction: async () => {
        handleLogin();
      },
      disabled: loading,
    },
  ];

  return (
    <SigninContainer>
      <SigninInfoContainer>
        <CustomText size={22} weight="bold" lineHeight="lg">로그인</CustomText>
        <TextInputContainer>
          <CustomTextInput
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <CustomTextInput
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            isPassword
          />
        </TextInputContainer>
      </SigninInfoContainer>
      <BottomButtonBar transitions={transition} />
    </SigninContainer>
  );
};

export default Signin;
