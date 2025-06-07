import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, ScrollView, Alert } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { FloatingLabelInput, PageHeader, AuthFooter } from '../../../components/Auth';
import Button from '../../../components/Button';
import axios from 'axios';
import { API_URL } from '@env';

// Conditional import for AsyncStorage
let AsyncStorage;
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (error) {
  console.warn('Failed to load AsyncStorage, token will not be persisted:', error);
}

export default function LoginScreen() {
  const { setLoggedIn } = useAuth();
  const navigation = useNavigation();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại và mật khẩu');
      return;
    }

    // Kiểm tra định dạng số điện thoại
    const cleanedPhone = phone.replace(/\D/g, '');
    const formattedPhone = cleanedPhone.startsWith('0') ? cleanedPhone : `0${cleanedPhone}`;
    const phoneRegex = /^(\+84|0)\d{9,10}$/;
    if (!phoneRegex.test(formattedPhone)) {
      Alert.alert('Lỗi', 'Số điện thoại phải bắt đầu bằng +84 hoặc 0 và có 10-11 chữ số');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/users/auth/login`, {
        phone: formattedPhone,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { token } = response.data;

      if (token) {
        if (AsyncStorage) {
          await AsyncStorage.setItem('userToken', token);
        } else {
          console.warn('AsyncStorage unavailable, token not saved');
        }
        setLoggedIn(true);
        Alert.alert('Thành công', 'Đăng nhập thành công');
      } else {
        Alert.alert('Lỗi', 'Không nhận được token từ server');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra kết nối hoặc thử lại.';
      Alert.alert('Lỗi', errorMessage);
      console.error('Login error:', error.message, error.response?.data);
    }
  };

  const handleSignup = () => {
    navigation.navigate('Signup1');
  };

  const handleForgotPassword = () => {
    navigation.navigate('Forgot1');
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Onboarding5');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <PageHeader
          title="Đăng nhập"
          subtitle="Chào mừng bạn quay lại!"
          onBack={handleBack}
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

          <Button
            title="ĐĂNG NHẬP"
            onPress={handleLogin}
            style={styles.loginButton}
          />

          <AuthFooter
            question="Chưa có tài khoản?"
            actionText="Đăng ký"
            onPress={handleSignup}
          />

          <AuthFooter
            question="Quên mật khẩu?"
            actionText="Khôi phục"
            onPress={handleForgotPassword}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  formContainer: {
    marginTop: 20,
  },
  loginButton: {
    marginTop: 30,
    marginBottom: 20,
  },
});