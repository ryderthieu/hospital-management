import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function Forgot1({ navigation }) {
  const [email, setEmail] = useState('');

  const handleNext = () => {
    // Kiểm tra tính hợp lệ của email
    if (email) {
      navigation.navigate('Forgot2');
    } else {
      alert('Vui lòng nhập email của bạn!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quên mật khẩu</Text>

      <TextInput
        style={styles.input}
        placeholder="Nhập email của bạn"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Button title="Tiếp tục" onPress={handleNext} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20,
  },
  title: {
    fontSize: 28, fontWeight: 'bold', marginBottom: 30,
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
});
