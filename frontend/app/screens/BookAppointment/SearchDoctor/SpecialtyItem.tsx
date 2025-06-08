import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import { Specialty } from '../types';
import { colors } from '../../../styles/globalStyles';
import { useFont, fontFamily } from '../../../context/FontContext';

interface SpecialtyItemProps {
  specialty: Specialty;
  onPress: () => void;
}

export const SpecialtyItem: React.FC<SpecialtyItemProps> = ({ specialty, onPress }) => {
  const { fontsLoaded } = useFont();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <TouchableOpacity style={styles.specialtyItem} onPress={onPress}>
      <View style={styles.specialtyIconContainer}>
        <Image source={specialty.icon} style={styles.specialtyIcon} />
      </View>
      <Text
        style={[styles.specialtyName, { fontFamily: fontFamily.bold }]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {specialty.name}
      </Text>
      <Text style={[styles.doctorCount, { fontFamily: fontFamily.regular }]}>
        {specialty.doctorCount > 0 ? `${specialty.doctorCount} bác sĩ` : 'Không có bác sĩ'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  specialtyItem: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 8,
    marginBottom: 16,
    width: '45%',
    alignItems: 'center',
    shadowColor: colors.base900,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  specialtyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.base50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  specialtyIcon: {
    width: 32,
    height: 32,
  },
  specialtyName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  doctorCount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});