import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageHeader, FloatingLabelInput } from '../../../components/Auth';
import Button from '../../../components/Button';
export default function Forgot2({ navigation, route }) {
  const { method } = route.params; 
  const [email, setEmail] = useState('');

  const handleNext = () => {
    if (email) {
      navigation.navigate('Forgot4', { method, email });
    } else {
      alert('Vui lòng nhập email của bạn!');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader
        title="Đặt lại mật khẩu"
        subtitle="Nhập email của bạn, chúng tôi sẽ gửi mã xác minh đến email."
        onBack={() => navigation.goBack()}
      />

      <FloatingLabelInput
        value={email}
        onChangeText={setEmail}
        placeholder="Nhập email"
        iconName="mail-outline"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Button
        title="GỬI MÃ XÁC MINH"
        onPress={handleNext}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
  },
});