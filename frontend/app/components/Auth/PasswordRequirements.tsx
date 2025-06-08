import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFont, fontFamily } from '../../context/FontContext';

type PasswordRequirementsProps = {
  password: string;
  show?: boolean;
};

const PasswordRequirements = ({ password, show = false }: PasswordRequirementsProps) => {
  const { fontsLoaded } = useFont();
  if (!show || !fontsLoaded) return null;

  const hasEightChars = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);

  const requirements = [
    { met: hasEightChars, text: 'Tối thiểu 8 ký tự' },
    { met: hasNumber, text: 'Ít nhất 1 chữ số (0-9)' },
    { met: hasUpperCase, text: 'Ít nhất 1 chữ cái in hoa' },
  ];

  return (
    <View style={styles.requirementsContainer}>
      {requirements.map((req, index) => (
        <View key={index} style={styles.requirementRow}>
          <Ionicons
            name={req.met ? 'checkmark-circle' : 'close-circle'}
            size={18}
            color={req.met ? '#34C759' : '#FF3B30'}
          />
          <Text style={styles.requirementText}>{req.text}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  requirementsContainer: {
    marginTop: 20,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  requirementText: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: '#2B2B2B',
    marginLeft: 8,
    flex: 1,
  },
});

export { PasswordRequirements };