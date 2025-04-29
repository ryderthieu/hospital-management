import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function Forgot5({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot 5</Text>
      <Button title="Tiếp tục" onPress={() => navigation.navigate('Forgot6')} />
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
