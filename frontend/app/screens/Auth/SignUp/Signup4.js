import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function Signup4({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup 4</Text>
      <Button
        title="Bắt đầu"
        onPress={() => navigation.navigate('Login')} // Điều hướng tới trang Login
      />
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
