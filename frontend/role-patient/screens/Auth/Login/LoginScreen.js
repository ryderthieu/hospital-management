import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useAuth } from '../../../context/AuthContext';  // Lấy giá trị từ context
import { useNavigation } from '@react-navigation/native';  // Để điều hướng

export default function LoginScreen() {
  const { setLoggedIn } = useAuth();  // Lấy hàm setLoggedIn từ context
  const navigation = useNavigation();  // Để điều hướng sau khi đăng nhập thành công

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email && password) {
      setLoggedIn(true);  // Cập nhật trạng thái đăng nhập
      // navigation.replace('Main');  // Điều hướng sang MainTabNavigator
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <Button title="Đăng nhập" onPress={handleLogin} />
      <View style={styles.optionContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Signup1')}>
          <Text style={styles.optionText}>Chưa có tài khoản? Đăng ký</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Forgot1')}>
          <Text style={styles.optionText}>Quên mật khẩu?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  optionContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  optionText: {
    marginTop: 10,
    color: '#007BFF',
    fontSize: 16,
  },
});
