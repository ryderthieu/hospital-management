import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, ScrollView, Text, Alert } from 'react-native';
import Button from '../../../components/Button';
import { FloatingLabelInput, PasswordRequirements, CheckboxWithLabel, PageHeader, AuthFooter } from '../../../components/Auth';
import axios from 'axios';
import { API_URL } from '@env';

export default function Signup1({ navigation }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    if (password.length > 0) {
      setShowValidation(true);
    } else {
      setShowValidation(false);
    }
  }, [password]);

  const handleContinue = async () => {
    if (!phone || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ số điện thoại và mật khẩu');
      return;
    }

    if (!termsAccepted) {
      Alert.alert('Lỗi', 'Bạn phải đồng ý với Điều khoản Dịch vụ và Chính sách Bảo mật');
      return;
    }

    // Kiểm tra định dạng số điện thoại
    const cleanedPhone = phone.replace(/\D/g, ''); // Loại bỏ ký tự không phải số
    const formattedPhone = cleanedPhone.startsWith('0') ? cleanedPhone : `0${cleanedPhone}`;
    const phoneRegex = /^(\+84|0)\d{9,10}$/;
    if (!phoneRegex.test(formattedPhone)) {
      Alert.alert('Lỗi', 'Số điện thoại phải bắt đầu bằng +84 hoặc 0 và có 10-11 chữ số');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        phone: formattedPhone,
        password,
        role: 'PATIENT', // Vai trò mặc định là PATIENT
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { message } = response.data || {};
      Alert.alert('Thành công', message || 'Đăng ký thành công, vui lòng tiếp tục');
      navigation.navigate('Signup2', { phone: formattedPhone, password });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.';
      Alert.alert('Lỗi', errorMessage);
      console.error('Signup error:', error.message, error.response?.data);
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
          title="TIẾP THEO"
          onPress={handleContinue}
          style={styles.continueButton}
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