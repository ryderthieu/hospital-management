import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Button_Other from "../../../components/Button_Other";

export default function Forgot7({ navigation }) {
  return (
    <View style={styles.container}>
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
    </View>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', 
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
});