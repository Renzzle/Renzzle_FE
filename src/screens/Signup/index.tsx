import React, { useState } from 'react';
import CustomTextInput from '../../components/common/CustomTextInput';
import { updateEmailAuthCode } from '../../apis/auth';
import { View } from 'react-native';
import Button from '../../components/common/Button';

const Signup = () => {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSendAuthCode = async () => {
    if (!email) {return;}

    try {
      setLoading(true);
      const data = await updateEmailAuthCode(email);
      setLoading(false);

      alert(`${data.response.code}`);
      console.log(`${data.response.code}`);

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
      <Button onPress={handleSendAuthCode} category="primary" disabled={loading}>인증번호 발급</Button>
    </View>
  );
};

export default Signup;
