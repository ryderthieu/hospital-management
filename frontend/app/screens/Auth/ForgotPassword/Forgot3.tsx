import React, { useState } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp, RouteProp } from '@react-navigation/native-stack';
import { PageHeader, FloatingLabelInput } from '../../../components/Auth';
import Button from '../../../components/Button';
import API from '../../../services/api';
import { useAlert } from '../../../context/AlertContext';

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

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Forgot3'>;
type RoutePropType = RouteProp<RootStackParamList, 'Forgot3'>;

interface Forgot3Props {
  navigation: NavigationProp;
  route: RoutePropType;
}

export default function Forgot3({ navigation, route }: Forgot3Props) {
  const { method } = route.params;
  const [phone, setPhone] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { showAlert } = useAlert();

  const handleNext = async () => {
    if (isLoading) return;

    if (!phone) {
      showAlert({ title: 'Lỗi', message: 'Vui lòng nhập số điện thoại của bạn!' });
      return;
    }

    const cleanedPhone = phone.replace(/\D/g, '');
    const formattedPhone = cleanedPhone.startsWith('0') ? cleanedPhone : `0${cleanedPhone}`;
    const phoneRegex = /^(\+84|0)\d{9,10}$/;
    if (!phoneRegex.test(formattedPhone)) {
      showAlert({ title: 'Lỗi', message: 'Số điện thoại phải bắt đầu bằng +84 hoặc 0 và có 10-11 chữ số' });
      return;
    }

    setIsLoading(true);
    try {
      await API.post('/users/auth/otp/send-sms', null, { params: { phoneNumber: formattedPhone } });
      showAlert({ title: 'Thành công', message: 'Mã OTP đã được gửi đến số điện thoại của bạn', buttons: [{ text: 'OK', onPress: () => navigation.navigate('Forgot5', { method, phone: formattedPhone }) }] });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Không thể gửi OTP. Vui lòng thử lại.';
      showAlert({ title: 'Lỗi', message: errorMessage });
      console.error('Send OTP error:', error.message, error.response?.data);
    } finally {
      setIsLoading(false);
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
        title={isLoading ? 'ĐANG XỬ LÝ...' : 'GỬI MÃ XÁC MINH'}
        onPress={handleNext}
        style={styles.button}
        disabled={isLoading}
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
  button: {
    marginTop: 20,
  },
});