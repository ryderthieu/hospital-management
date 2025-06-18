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

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Forgot2'>;
type RoutePropType = RouteProp<RootStackParamList, 'Forgot2'>;

interface Forgot2Props {
  navigation: NavigationProp;
  route: RoutePropType;
}

export default function Forgot2({ navigation, route }: Forgot2Props) {
  const { method } = route.params;
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { showAlert } = useAlert();

  const handleNext = async () => {
    if (isLoading) return;

    if (!email) {
      showAlert({ title: 'Lỗi', message: 'Vui lòng nhập email của bạn!' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert({ title: 'Lỗi', message: 'Email không hợp lệ!' });
      return;
    }

    setIsLoading(true);
    try {
      await API.post('/users/auth/otp/send-email', null, { params: { email } });
      showAlert({ title: 'Thành công', message: 'Mã OTP đã được gửi đến email của bạn', buttons: [{ text: 'OK', onPress: () => navigation.navigate('Forgot4', { method, email }) }] });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Không thể gửi OTP. Vui lòng thử lại.';
      showAlert({ title: 'Lỗi', message: errorMessage });
      console.error('Send OTP email error:', error.message, error.response?.data);
    } finally {
      setIsLoading(false);
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
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
  },
  button: {
    marginTop: 20,
  },
});