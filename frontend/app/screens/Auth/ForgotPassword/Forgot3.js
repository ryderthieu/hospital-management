import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageHeader, FloatingLabelInput } from '../../../components/Auth';
import Button from '../../../components/Button';

export default function Forgot3({ navigation, route }) {
  const { method } = route.params; // Get the method (should be 'phone')
  const [phone, setPhone] = useState(''); // State for phone input

  const handleNext = () => {
    if (phone) {
      // Navigate to the next screen to enter the verification code
      navigation.navigate('Forgot5', { method, phone });
    } else {
      alert('Vui lòng nhập số điện thoại của bạn!');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader
        title="Đặt lại mật khẩu"
        subtitle="Nhập số điện thoại của bạn, chúng tôi sẽ gửi mã xác minh đến số điện thoại."
        onBack={() => navigation.goBack()}
      />

      <FloatingLabelInput
        value={phone}
        onChangeText={setPhone}
        placeholder="Nhập số điện thoại"
        iconName="call-outline"
        keyboardType="phone-pad"
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