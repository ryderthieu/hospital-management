import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function Forgot4({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot 4</Text>
      <Button title="Tiếp tục" onPress={() => navigation.navigate('Forgot5')} />
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
