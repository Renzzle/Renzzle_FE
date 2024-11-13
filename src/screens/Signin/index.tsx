import React, { useState } from 'react';
import CustomTextInput from '../../components/common/CustomTextInput';
import { login } from '../../apis/auth';
import { View } from 'react-native';
import Button from '../../components/common/Button';

const Signin = () => {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [password, setPassword] = useState<string>(''); //login용

  const handleLogin = async () => {
    if (!email) {return;}

    try {
      setLoading(true);
      const data = await login(email, password);
      setLoading(false);

      alert(`${data.response.accessToken}`);
      console.log(`${data.response.accessToken}`);

      if (data && data.success) {
        alert('Success');
      } else {
        alert('Error');
      }
    } catch (error) {
      setLoading(false);
      alert('Error');
    }
  };

  return (
    <View>
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
      />
      <Button onPress={handleLogin} category="primary" disabled={loading}>로그인</Button>
    </View>
  );
};

export default Signin;
