import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Button_Other from '../../../components/Button_Other';
import { useFont, fontFamily } from '../../../context/FontContext';

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

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Forgot7'>;

interface Forgot7Props {
  navigation: NavigationProp;
}

export default function Forgot7({ navigation }: Forgot7Props) {
  const { fontsLoaded } = useFont();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.checkmark}>✔</Text>
      </View>

      <Text style={styles.title}>Mật khẩu đã được thay đổi</Text>
      <Text style={styles.subtitle}>
        Mật khẩu đã được thay đổi thành công, bạn có thể đăng nhập lại bằng mật khẩu mới.
      </Text>

      <Button_Other
        title="ĐĂNG NHẬP NGAY"
        onPress={() => navigation.navigate('Login')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00B5B8',
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginBottom: 30,
  },
  checkmark: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    textAlign: 'center',
    lineHeight: 80,
    fontSize: 40,
    color: '#00B5B8',
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
});