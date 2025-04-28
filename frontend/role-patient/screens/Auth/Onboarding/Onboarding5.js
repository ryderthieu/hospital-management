import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function Onboarding5({ navigation }) {
  const handleStart = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chào mừng bạn đến với ứng dụng!</Text>
      <Button title="Bắt đầu" onPress={handleStart} />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
});
