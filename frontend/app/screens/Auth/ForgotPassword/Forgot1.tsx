import React, { useState } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PageHeader, VerificationOptionCard } from '../../../components/Auth';

type RootStackParamList = {
  Forgot1: undefined;
  Forgot2: { method: 'email' };
  Forgot3: { method: 'phone' };
  Forgot4: { method: 'email'; email: string };
  Forgot5: { method: 'phone'; phone: string };
  Forgot6: { resetToken: string; phone?: string; email?: string };
  Forgot7: undefined;
  Login: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Forgot1'>;

interface Forgot1Props {
  navigation: NavigationProp;
}

export default function Forgot1({ navigation }: Forgot1Props) {
  const [selectedOption, setSelectedOption] = useState<string>('');

  const handleNext = (method: 'email' | 'phone') => {
    if (method) {
      setSelectedOption(method);
      if (method === 'email') {
        navigation.navigate('Forgot2', { method });
      } else if (method === 'phone') {
        navigation.navigate('Forgot3', { method });
      }
    } else {
      alert('Vui lòng chọn một phương thức xác minh!');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader
        title="Quên mật khẩu"
        subtitle="Chọn phương thức xác minh và chúng tôi sẽ gửi mã xác minh cho bạn."
        onBack={() => navigation.goBack()}
      />

      <VerificationOptionCard
        iconName="mail-outline"
        title="Email"
        value="******@gmail.com"
        onPress={() => handleNext('email')}
      />

      <VerificationOptionCard
        iconName="call-outline"
        title="Số điện thoại"
        value="******2345"
        onPress={() => handleNext('phone')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
  },
});