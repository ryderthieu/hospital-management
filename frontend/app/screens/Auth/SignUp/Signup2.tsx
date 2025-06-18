import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, ScrollView, Text, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Button from '../../../components/Button';
import {
  FloatingLabelInputNotIcon,
  CheckboxWithLabel,
  PageHeader,
  AuthFooter,
  Dropdown,
  DatePickerField,
} from '../../../components/Auth';
import API from '../../../services/api';
import { useAlert } from '../../../context/AlertContext';

type RootStackParamList = {
  Login: undefined;
  Signup2: { phone: string; password: string };
  Signup3: { phone: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Signup2'>;
type RoutePropType = RouteProp<RootStackParamList, 'Signup2'>;

interface Signup2Props {
  navigation: NavigationProp;
  route: RoutePropType;
}

export default function Signup2({ navigation, route }: Signup2Props) {
  const { phone, password } = route.params;
  const { showAlert } = useAlert();

  const [fullName, setFullName] = useState<string>('');
  const [idNumber, setIdNumber] = useState<string>('');
  const [insuranceNumber, setInsuranceNumber] = useState<string>('');
  const [dob, setDob] = useState<Date | null>(null);
  const [address, setAddress] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleContinue = async () => {
    if (isLoading) return;

    const errors: string[] = [];
    if (!fullName.trim()) errors.push('Tên không được để trống');
    if (!idNumber) errors.push('CCCD/CMND không được để trống');
    if (!insuranceNumber) errors.push('Số bảo hiểm y tế không được để trống');
    if (!dob) errors.push('Ngày sinh không được để trống');
    if (!gender) errors.push('Giới tính không được chọn');
    if (!address.trim()) errors.push('Địa chỉ không được để trống');
    if (!termsAccepted) errors.push('Vui lòng đồng ý với Điều khoản Dịch vụ và Chính sách Bảo mật');

    if (errors.length > 0) {
      showAlert({ title: 'Lỗi', message: errors.join('\n') });
      return;
    }

    const idNumberRegex = /^\d{9,12}$/;
    if (!idNumberRegex.test(idNumber)) {
      showAlert({ title: 'Lỗi', message: 'Số CCCD/CMND phải có 9 hoặc 12 số' });
      return;
    }

    const insuranceRegex = /^\d{10,15}$/;
    if (!insuranceRegex.test(insuranceNumber)) {
      showAlert({ title: 'Lỗi', message: 'Số bảo hiểm y tế phải từ 10-15 số' });
      return;
    }

    const today = new Date();
    if (isNaN(dob.getTime()) || dob >= today) {
      showAlert({ title: 'Lỗi', message: 'Ngày sinh không hợp lệ' });
      return;
    }

    if (!['MALE', 'FEMALE', 'OTHER'].includes(gender.toUpperCase())) {
      showAlert({ title: 'Lỗi', message: 'Giới tính phải là Nam (MALE), Nữ (FEMALE), hoặc Khác (OTHER)' });
      return;
    }

    setIsLoading(true);
    try {
      const dobString = dob.toISOString().split('T')[0];
      const payload = {
        phone,
        password,
        fullName: fullName.trim(),
        identityNumber: idNumber,
        insuranceNumber,
        birthday: dobString,
        gender: gender.toUpperCase(),
        address: address.trim(),
      };
      console.log('Debug - Payload:', payload);

      const response = await API.post<{ message: string }>('/users/auth/register', payload);

      showAlert({ title: 'Thành công', message: response.data.message || 'Vui lòng xác thực OTP' });
      navigation.navigate('Signup3', { phone });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Lưu thông tin thất bại. Vui lòng thử lại.';
      showAlert({ title: 'Lỗi', message: errorMessage });
      console.error('Signup2 error:', error.message, error.response?.data);
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
          subtitle="Hoàn tất thông tin cá nhân"
          onBack={() => navigation.goBack()}
        />

        <View style={styles.formContainer}>
          <FloatingLabelInputNotIcon
            value={fullName}
            onChangeText={setFullName}
            placeholder="Nhập họ và tên"
            keyboardType="default"
            autoCapitalize="words"
          />

          <FloatingLabelInputNotIcon
            value={idNumber}
            onChangeText={setIdNumber}
            placeholder="Nhập CCCD/CMND"
            keyboardType="numeric"
          />

          <FloatingLabelInputNotIcon
            value={insuranceNumber}
            onChangeText={setInsuranceNumber}
            placeholder="Nhập số bảo hiểm y tế"
            keyboardType="numeric"
          />

          <DatePickerField
            label="Ngày sinh"
            value={dob || new Date()}
            onChange={setDob}
          />

          <Dropdown
            value={gender}
            onSelect={setGender}
            placeholder="Giới tính"
            options={[
              { label: 'Nam', value: 'MALE' },
              { label: 'Nữ', value: 'FEMALE' },
              { label: 'Khác', value: 'OTHER' },
            ]}
          />

          <FloatingLabelInputNotIcon
            value={address}
            onChangeText={setAddress}
            placeholder="Nhập địa chỉ đầy đủ"
            keyboardType="default"
          />

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