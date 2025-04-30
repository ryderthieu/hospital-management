import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useFont, fontFamily } from '../context/FontContext';
export default function Button_Other({ title, onPress, style, textStyle }) {
  const { fontsLoaded } = useFont();
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 40,
  },
  buttonText: {
    fontFamily: fontFamily.bold,
    color: '#00B5B8',
    fontSize: 18,
  },
});
