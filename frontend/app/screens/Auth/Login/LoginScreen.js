import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import {
  FloatingLabelInput,
  PageHeader,
  AuthFooter
} from '../../../components/Auth';
import Button from '../../../components/Button';

export default function LoginScreen() {
  const { setLoggedIn } = useAuth();
  const navigation = useNavigation();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (phoneNumber && password) {
      setLoggedIn(true);
      // navigation.replace('Main');
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
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Nhập số điện thoại"
            iconName="phone-portrait-outline"
            keyboardType="email-address"
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
