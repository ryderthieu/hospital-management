import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageHeader, VerificationOptionCard } from "../../../components/Auth";

export default function Forgot1({ navigation }) {
  const [selectedOption, setSelectedOption] = useState(''); 

  const handleNext = (method) => {
    if (method) {
      setSelectedOption(method);
      if (method === 'email') {
        navigation.navigate('Forgot2', { method }); // Navigate to Forgot2 for email
      } else if (method === 'phone') {
        navigation.navigate('Forgot3', { method }); // Navigate to Forgot3 for phone
      }
    } else {
      alert('Vui lòng chọn một phương thức xác minh!');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader
        title="Quên mật khẩu"
        subtitle="Chọn phương thức xác minh và chứng tỏ sẽ gửi mã xác minh cho bạn."
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