import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Doctor } from '../types';
import { colors } from '../../../styles/globalStyles';

interface DoctorHeaderProps {
  doctor: Doctor;
}

export const DoctorHeader: React.FC<DoctorHeaderProps> = ({ doctor }) => {
  return (
    <View style={styles.doctorHeaderCard}>
      <Image source={doctor.image} style={styles.bookingDoctorImage} />
      <View style={styles.bookingDoctorInfo}>
        <Text style={styles.bookingDoctorName}>{doctor.name}</Text>
        <Text style={styles.bookingDoctorSpecialty}>{doctor.specialty}</Text>
        {doctor.room && <Text style={styles.bookingDoctorRoom}>{doctor.room}</Text>}
        <Text style={styles.bookingDoctorPrice}>{doctor.price}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  doctorHeaderCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: 16,
    marginBottom: 16,
  },
  bookingDoctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  bookingDoctorInfo: {
    flex: 1,
  },
  bookingDoctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 2,
  },
  bookingDoctorSpecialty: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  bookingDoctorRoom: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  bookingDoctorPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
});