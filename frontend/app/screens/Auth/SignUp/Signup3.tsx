import React, { useState, useRef } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, ScrollView, Text, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Button from '../../../components/Button';
import { PageHeader, PhoneNumberDisplay, OtpInput, ResendTimer } from '../../../components/Auth';
import API from '../../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../../context/AuthContext';
import { useAlert } from '../../../context/AlertContext';

type RootStackParamList = {
  Signup2: { phone: string; password: string };
  Signup3: { phone: string };
  Signup4: undefined;
  Login: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Signup3'>;
type RoutePropType = RouteProp<RootStackParamList, 'Signup3'>;

interface Signup3Props {
  navigation: NavigationProp;
  route: RoutePropType;
}

interface VerifyResponse {
  userId: number;
  role: string;
  token?: string;
}

export default function Signup3({ navigation, route }: Signup3Props) {
  const { setLoggedIn } = useAuth();
  const { phone } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const { showAlert } = useAlert();

  const handleVerify = async () => {
    if (isLoading) return;

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      showAlert({
        title: 'Lỗi',
        message: 'Vui lòng nhập đủ 6 chữ số OTP',
        buttons: [{ text: 'OK' }],
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await API.post<VerifyResponse>('/users/auth/register/verify', {
        phone,
        otp: otpString,
      });

      const { token } = response.data;
      if (token) {
        await AsyncStorage.setItem('token', token);
        setLoggedIn(true);
      }

      showAlert({
        title: 'Thành công',
        message: 'Đăng ký thành công',
        buttons: [{ text: 'OK', onPress: () => navigation.navigate('Signup4') }],
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Xác thực OTP thất bại. Vui lòng thử lại.';
      showAlert({
        title: 'Lỗi',
        message: errorMessage,
        buttons: [{ text: 'OK' }],
      });
      console.error('Verify OTP error:', error.message, error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await API.post('/users/auth/otp/send-sms', null, { params: { phoneNumber: phone } });
      showAlert({
        title: 'Thành công',
        message: 'Mã OTP đã được gửi lại',
        buttons: [{ text: 'OK' }],
      });
    } catch (error: any) {
      showAlert({
        title: 'Lỗi',
        message: 'Không thể gửi lại OTP. Vui lòng thử lại.',
        buttons: [{ text: 'OK' }],
      });
      console.error('Resend OTP error:', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <PageHeader
          title="Xác minh OTP"
          subtitle={
            <Text>
              Vui lòng nhập mã OTP 6 số mà chúng tôi đã gửi đến số điện thoại{' '}
              <PhoneNumberDisplay phoneNumber={phone} />
            </Text>
          }
          onBack={() => navigation.goBack()}
        />

        <View style={styles.formContainer}>
          <OtpInput otp={otp} setOtp={setOtp} inputRefs={inputRefs} />
          <ResendTimer initialTime={60} onResend={handleResendOtp} />
        </View>

        <Button
          title={isLoading ? 'ĐANG XỬ LÝ...' : 'XÁC THỰC'}
          onPress={handleVerify}
          style={styles.continueButton}
          disabled={isLoading}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 50,
  },
  continueButton: {
    marginTop: 50,
    marginBottom: 20,
  },
});