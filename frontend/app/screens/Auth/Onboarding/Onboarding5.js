import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
export default function Onboarding5({ navigation }) {
  const handleStart = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.gradientWrapper}>
          <LinearGradient
            colors={["#FFFFFF", "#AFECEF", "#7EDCE2"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cornerGradient}
          />
        </View>

      {/* Logo + Background */}
      <View style={styles.logoSection}>
        <Image
          source={require('../../../assets/images/logo/Logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Slogan */}
      <View style={styles.textSection}>
        <Text style={styles.title}>Chăm sóc tận tình</Text>
        <Text style={styles.title}>Bệnh tình tan biến</Text>
      </View>

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={handleStart}>
        <Text style={styles.buttonText}>BẮT ĐẦU NGAY</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 30,
  },
  logoSection: {
    marginTop: 60,
    alignItems: 'center',
  },
  logo: {
    width: 300,
    height: 100,
  },
  textSection: {
    alignItems: 'center',
    marginVertical: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2B2B2B',
    marginBottom: 8,
  },
  button: {
    width: '100%',
    backgroundColor: '#00B5B8',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginText: {
    color: '#8A8A8A',
    fontSize: 14,
  },
  loginLink: {
    color: '#00B5B8',
    fontWeight: '600',
  },
});
