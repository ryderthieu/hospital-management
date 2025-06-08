import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, ScrollView, Text, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Button from '../../../components/Button';
import { FloatingLabelInput, PasswordRequirements, CheckboxWithLabel, PageHeader, AuthFooter } from '../../../components/Auth';
import API from '../../../services/api';

type RootStackParamList = {
  Login: undefined;
  Signup2: { phone: string; password: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Signup1Props {
  navigation: NavigationProp;
}

interface RegisterResponse {
  message: string;
}

export default function Signup1({ navigation }: Signup1Props) {
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [showValidation, setShowValidation] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setShowValidation(password.length > 0);
  }, [password]);

  const handleContinue = async () => {
    if (isLoading) return;

    if (!phone || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ số điện thoại và mật khẩu');
      return;
    }

    if (!termsAccepted) {
      Alert.alert('Lỗi', 'Bạn phải đồng ý với Điều khoản Dịch vụ và Chính sách Bảo mật');
      return;
    }

    const cleanedPhone = phone.replace(/\D/g, '');
    const formattedPhone = cleanedPhone.startsWith('0') ? cleanedPhone : `0${cleanedPhone}`;
    const phoneRegex = /^(\+84|0)\d{9,10}$/;
    if (!phoneRegex.test(formattedPhone)) {
      Alert.alert('Lỗi', 'Số điện thoại phải bắt đầu bằng +84 hoặc 0 và có 10-11 chữ số');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        phone: formattedPhone,
        password,
        fullName: 'temp',
        identityNumber: 'temp',
        insuranceNumber: 'temp',
        birthday: '2000-01-01',
        gender: 'OTHER',
        address: 'temp',
      };
      const response = await API.post<RegisterResponse>('/users/auth/register', payload);

      Alert.alert('Thành công', response.data.message || 'Vui lòng nhập thông tin cá nhân', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Signup2', { phone: formattedPhone, password }),
        },
      ]);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.';
      Alert.alert('Lỗi', errorMessage);
      console.error('Signup error:', error.message, error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <PageHeader
          title="Đăng ký"
          subtitle="Tạo tài khoản và trải nghiệm dịch vụ"
          onBack={() => navigation.goBack()}
        />

        <View style={styles.formContainer}>
          <FloatingLabelInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Nhập số điện thoại"
            iconName="phone-portrait-outline"
            keyboardType="phone-pad"
          />

          <FloatingLabelInput
            value={password}
            onChangeText={setPassword}
            placeholder="Nhập mật khẩu"
            iconName="lock-closed-outline"
            secureTextEntry={true}
            showPasswordToggle={true}
          />

          <PasswordRequirements password={password} show={showValidation} />

          <CheckboxWithLabel
            checked={termsAccepted}
            onToggle={() => setTermsAccepted(!termsAccepted)}
          >
            Tôi đồng ý với <Text style={styles.linkText}>Điều khoản Dịch vụ</Text> và{' '}
            <Text style={styles.linkText}>Chính sách Bảo mật</Text> của ứng dụng.
          </CheckboxWithLabel>
        </View>

        <Button
          title={isLoading ? 'ĐANG XỬ LÝ...' : 'TIẾP THEO'}
          onPress={handleContinue}
          style={styles.continueButton}
          disabled={isLoading}
        />

        <AuthFooter
          question="Đã có tài khoản?"
          actionText="Đăng nhập"
          onPress={handleLogin}
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
  },
  linkText: {
    color: '#00B5B8',
    fontWeight: '500',
  },
  continueButton: {
    marginTop: 30,
    marginBottom: 20,
  },
});