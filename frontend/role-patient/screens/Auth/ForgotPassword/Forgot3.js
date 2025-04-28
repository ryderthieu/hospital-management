import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function Forgot3({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot 3</Text>
      <Button title="Tiếp tục" onPress={() => navigation.navigate('Forgot4')} />
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
