import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Button_Other from "../../../components/Button_Other";
import { useFont, fontFamily } from '../../../context/FontContext';
export default function Signup4({ navigation }) {
  const { fontsLoaded } = useFont();
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.checkmark}>✔</Text>
      </View>

      <Text style={styles.title}>Tài khoản đã được xác minh</Text>
      <Text style={styles.subtitle}>
        Tài khoản của bạn đã được xác minh thành công, Hãy cùng khám phá các tính năng của eCare nhé!
      </Text>

      <Button_Other
        title="BẮT ĐẦU"
        onPress={() => navigation.navigate('Login')} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00B5B8', 
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginBottom: 30,
  },
  checkmark: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    textAlign: 'center',
    lineHeight: 80, 
    fontSize: 40,
    color: '#00B5B8',
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 24,
    color: '#fff', 
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
});