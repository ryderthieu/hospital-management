import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function Onboarding4({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Onboarding 4</Text>
      <Button title="Tiếp tục" onPress={() => navigation.navigate('Onboarding5')} />
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
