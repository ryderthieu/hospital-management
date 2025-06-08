import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useFont, fontFamily } from '../../context/FontContext';

type PhoneNumberDisplayProps = {
  phoneNumber: string;
};

const PhoneNumberDisplay = ({ phoneNumber }: PhoneNumberDisplayProps) => {
  const { fontsLoaded } = useFont();
  if (!fontsLoaded) return null;

  const formattedPhoneNumber = phoneNumber.slice(0, -4) + '****';
  return <Text style={styles.text}>{formattedPhoneNumber}</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: '#2B2B2B',
  },
});

export { PhoneNumberDisplay };