import React, { useState, useRef } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, ScrollView, Text, Alert } from 'react-native';
import { NativeStackNavigationProp, RouteProp } from '@react-navigation/native-stack';
import Button from '../../../components/Button';
import { PageHeader, PhoneNumberDisplay, OtpInput, ResendTimer } from '../../../components/Auth';
import API from '../../../services/api';
import { TextInput } from 'react-native';

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

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Forgot5'>;
type RoutePropType = RouteProp<RootStackParamList, 'Forgot5'>;

interface Forgot5Props {
  navigation: NavigationProp;
  route: RoutePropType;
}

interface AuthDTOs {
  OtpValidationResponse: {
    resetToken: string;
  };
}

export default function Forgot5({ navigation, route }: Forgot5Props) {
  const { phone } = route.params;
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleVerify = async () => {
    if (isLoading) return;

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      Alert.alert('Lỗi', 'Vui lòng nhập đủ 6 chữ số OTP');
      return;
    }

    setIsLoading(true);
    try {
      const response = await API.post<AuthDTOs['OtpValidationResponse']>('/users/auth/otp/validate-sms', null, {
        params: { phoneNumber: phone, otp: otpString },
      });
      const { resetToken } = response.data;
      if (!resetToken) {
        throw new Error('Không nhận được resetToken');
      }
      Alert.alert('Thành công', 'Xác thực OTP thành công', [
        { text: 'OK', onPress: () => navigation.navigate('Forgot6', { phone, resetToken }) },
      ]);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Xác thực OTP thất bại. Vui lòng thử lại.';
      Alert.alert('Lỗi', errorMessage);
      console.error('Verify OTP error:', error.message, error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await API.post('/users/auth/otp/send-sms', null, { params: { phoneNumber: phone } });
      Alert.alert('Thành công', 'Mã OTP đã được gửi lại');
    } catch (error: any) {
      Alert.alert('Lỗi', 'Không thể gửi lại OTP. Vui lòng thử lại.');
      console.error('Resend OTP error:', error.message);
    } finally {
      setIsLoading(false);
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
              Vui lòng nhập OTP 6 số mà chúng tôi đã gửi đến số điện thoại{' '}
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