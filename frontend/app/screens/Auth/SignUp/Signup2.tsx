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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../../context/AuthContext';

type RootStackParamList = {
  Login: undefined;
  Signup3: undefined;
  Signup1: undefined;
  Signup2: { phone: string; password: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Signup2'>;
type RoutePropType = RouteProp<RootStackParamList, 'Signup2'>;

interface Signup2Props {
  navigation: NavigationProp;
  route: RoutePropType;
}

export default function Signup2({ navigation, route }: Signup2Props) {
  const { setLoggedIn } = useAuth();
  const { phone, password } = route.params;

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

    // Debug: Kiểm tra giá trị các trường
    console.log('Debug - Input values:', {
      fullName,
      idNumber,
      insuranceNumber,
      dob: dob ? dob.toISOString() : null,
      gender,
      address,
      termsAccepted,
    });

    // Kiểm tra các trường bắt buộc với lỗi cụ thể
    const errors: string[] = [];
    if (!fullName.trim()) errors.push('Tên không được để trống');
    if (!idNumber) errors.push('CCCD/CMND không được để trống');
    if (!insuranceNumber) errors.push('Số bảo hiểm y tế không được để trống');
    if (!dob) errors.push('Ngày sinh không được để trống');

    if (errors.length > 0) {
      Alert.alert('Lỗi', errors.join('\n'));
      return;
    }

    if (!termsAccepted) {
      Alert.alert('Lỗi', 'Bạn phải đồng ý với Điều khoản Dịch vụ và Chính sách Bảo mật');
      return;
    }

    // Kiểm tra định dạng CCCD/CMND (9 hoặc 12 số)
    const idNumberRegex = /^\d{9,12}$/;
    if (!idNumberRegex.test(idNumber)) {
      Alert.alert('Lỗi', 'Số CCCD/CMND phải có 9 hoặc 12 chữ số');
      return;
    }

    // Kiểm tra định dạng số bảo hiểm y tế (10 hoặc 15 số)
    const insuranceRegex = /^\d{10,15}$/;
    if (!insuranceRegex.test(insuranceNumber)) {
      Alert.alert('Lỗi', 'Số bảo hiểm y tế phải có 10-15 chữ số');
      return;
    }

    // Kiểm tra ngày sinh
    const today = new Date();
    if (isNaN(dob.getTime()) || dob >= today) {
      Alert.alert('Lỗi', 'Ngày sinh không hợp lệ');
      return;
    }

    setIsLoading(true);
    try {
      // Chuyển đổi dob thành chuỗi YYYY-MM-DD
      const dobString = dob.toISOString().split('T')[0];

      // Gửi yêu cầu tới endpoint /patients
      const response = await API.post<{ message: string; token?: string }>('/patients', {
        identityNumber: idNumber,
        insuranceNumber,
        fullName: fullName.trim(),
        birthday: dobString,
        gender: gender || undefined,
        address: address || undefined,
        phone,
      });

      const { message, token } = response.data;

      // Nếu backend trả về token, lưu và đăng nhập
      if (token) {
        await AsyncStorage.setItem('token', token);
        setLoggedIn(true);
      }

      Alert.alert('Thành công', message || 'Thông tin bệnh nhân đã được lưu', [
        { text: 'OK', onPress: () => navigation.navigate('Signup3') },
      ]);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Lưu thông tin thất bại. Vui lòng thử lại.';
      Alert.alert('Lỗi', errorMessage);
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
            onChangeText={(text: string) => {
              console.log('fullName input:', text);
              setFullName(text);
            }}
            placeholder="Nhập họ và tên"
            keyboardType="default"
            autoCapitalize="words"
            editable={true}
          />

          <FloatingLabelInputNotIcon
            value={idNumber}
            onChangeText={(text: string) => {
              console.log('idNumber input:', text);
              setIdNumber(text);
            }}
            placeholder="Nhập CCCD/CMND"
            keyboardType="numeric"
            editable={true}
          />

          <FloatingLabelInputNotIcon
            value={insuranceNumber}
            onChangeText={(text: string) => {
              console.log('insuranceNumber input:', text);
              setInsuranceNumber(text);
            }}
            placeholder="Nhập số bảo hiểm y tế"
            keyboardType="numeric"
            editable={true}
          />

          <DatePickerField
            label="Ngày sinh"
            value={dob || new Date()}
            onChange={(date: Date) => {
              console.log('dob selected:', date.toISOString());
              setDob(date);
            }}
          />

          <Dropdown
            value={gender}
            onSelect={(value: string) => {
              console.log('gender selected:', value);
              setGender(value);
            }}
            placeholder="Giới tính"
            options={[
              { label: 'Nam', value: 'MALE' },
              { label: 'Nữ', value: 'FEMALE' },
              { label: 'Khác', value: 'OTHER' },
            ]}
          />

          <FloatingLabelInputNotIcon
            value={address}
            onChangeText={(text: string) => {
              console.log('address input:', text);
              setAddress(text);
            }}
            placeholder="Nhập địa chỉ đầy đủ"
            keyboardType="default"
            editable={true}
          />

          <CheckboxWithLabel
            checked={termsAccepted}
            onToggle={() => {
              console.log('termsAccepted toggled:', !termsAccepted);
              setTermsAccepted(!termsAccepted);
            }}
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