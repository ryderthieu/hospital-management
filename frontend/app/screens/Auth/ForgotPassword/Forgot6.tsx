import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, ScrollView, Text, Alert } from 'react-native';
import { NativeStackNavigationProp, RouteProp } from '@react-navigation/native-stack';
import Button from '../../../components/Button';
import { FloatingLabelInput, PasswordRequirements, PageHeader } from '../../../components/Auth';
import API from '../../../services/api';

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

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Forgot6'>;
type RoutePropType = RouteProp<RootStackParamList, 'Forgot6'>;

interface Forgot6Props {
  navigation: NavigationProp;
  route: RoutePropType;
}

interface AuthDTOs {
  ResetPasswordResponse: {
    message: string;
  };
}

export default function Forgot6({ navigation, route }: Forgot6Props) {
  const { resetToken, phone, email } = route.params;
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showValidation, setShowValidation] = useState<boolean>(false);
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (password.length > 0) {
      setShowValidation(true);
    } else {
      setShowValidation(false);
    }

    const meetsLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const isValid = meetsLength && hasUpperCase && hasNumber;
    setIsPasswordValid(isValid);

    if (confirmPassword.length > 0) {
      setPasswordsMatch(password === confirmPassword);
    } else {
      setPasswordsMatch(true);
    }
  }, [password, confirmPassword]);

  const handleContinue = async () => {
    if (isLoading) return;

    if (!isPasswordValid) {
      Alert.alert('Lỗi', 'Mật khẩu không đáp ứng các yêu cầu. Vui lòng kiểm tra lại!');
      return;
    }

    if (!passwordsMatch) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp. Vui lòng nhập lại!');
      return;
    }

    if (!password || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ mật khẩu và xác nhận mật khẩu!');
      return;
    }

    setIsLoading(true);
    try {
      const response = await API.put<AuthDTOs['ResetPasswordResponse']>('/users/auth/reset-password', {
        resetToken,
        password,
      });
      Alert.alert('Thành công', response.data.message || 'Mật khẩu đã được đặt lại', [
        { text: 'OK', onPress: () => navigation.navigate('Forgot7') },
      ]);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.';
      Alert.alert('Lỗi', errorMessage);
      console.error('Reset password error:', error.message, error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <PageHeader
          title="Mật khẩu mới"
          subtitle="Tạo mật khẩu mới an toàn và dễ nhớ"
          onBack={() => navigation.goBack()}
        />

        <View style={styles.formContainer}>
          <FloatingLabelInput
            value={password}
            onChangeText={setPassword}
            placeholder="Nhập mật khẩu mới"
            iconName="lock-closed-outline"
            secureTextEntry={true}
            showPasswordToggle={true}
          />

          <FloatingLabelInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Xác nhận mật khẩu mới"
            iconName="lock-closed-outline"
            secureTextEntry={true}
            showPasswordToggle={true}
          />

          {confirmPassword.length > 0 && !passwordsMatch && (
            <Text style={styles.errorText}>Mật khẩu xác nhận không khớp</Text>
          )}

          <PasswordRequirements password={password} show={showValidation} />
        </View>

        <Button
          title={isLoading ? 'ĐANG XỬ LÝ...' : 'TIẾP THEO'}
          onPress={handleContinue}
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
  },
  continueButton: {
    marginTop: 30,
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
    marginBottom: 10,
  },
});