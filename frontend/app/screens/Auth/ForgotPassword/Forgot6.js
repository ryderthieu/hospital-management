import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function Forgot6({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mật khẩu đã được thay đổi</Text>
      <Button title="Đăng nhập ngay" onPress={() => navigation.navigate('Login')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
