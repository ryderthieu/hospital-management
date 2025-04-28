import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Onboarding1({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Onboarding2');
    }, 4000); // 4 giây

    return () => clearTimeout(timer); 
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Onboarding 1</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },
  title: {
    fontSize: 24,
  },
});
