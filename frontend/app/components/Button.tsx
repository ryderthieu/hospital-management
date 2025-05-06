import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useFont, fontFamily } from '../context/FontContext';

type ButtonProps = {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export default function Button({ title, onPress, style, textStyle }: ButtonProps) {
  const { fontsLoaded } = useFont();
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    backgroundColor: '#00B5B8',
    paddingVertical: 16,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 40,
  },
  buttonText: {
    fontFamily: fontFamily.bold,
    color: '#FFFFFF',
    fontSize: 18,
  },
});
