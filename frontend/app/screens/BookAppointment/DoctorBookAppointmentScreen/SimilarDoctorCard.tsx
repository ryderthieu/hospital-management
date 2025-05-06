import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Doctor } from '../types';
import { colors } from '../../../styles/globalStyles';

interface SimilarDoctorCardProps {
  doctor: Doctor;
}

export const SimilarDoctorCard: React.FC<SimilarDoctorCardProps> = ({ doctor }) => {
  return (
    <View style={styles.similarDoctorCard}>
      <Image source={doctor.image} style={styles.similarDoctorImage} />
      <Text style={styles.similarDoctorName}>{doctor.name}</Text>
      <Text style={styles.similarDoctorSpecialty}>{doctor.specialty}</Text>
      <Text style={styles.similarDoctorPrice}>{doctor.price}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  similarDoctorCard: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    padding: 12,
  },
  similarDoctorImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 8,
  },
  similarDoctorName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  similarDoctorSpecialty: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  similarDoctorPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
});