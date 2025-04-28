import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function Signup2({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup 2</Text>
      <Button title="Tiếp tục" onPress={() => navigation.navigate('Signup3')} />
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
