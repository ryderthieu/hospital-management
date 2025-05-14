import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Doctor } from '../types';
import { colors } from '../../../styles/globalStyles';
import { useFont, fontFamily } from '../../../context/FontContext';

interface DoctorCardProps {
  doctor: Doctor;
  onPress: () => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onPress }) => {
  const { fontsLoaded } = useFont();
  return (
    <TouchableOpacity style={styles.doctorCard} onPress={onPress}>
      <Image source={doctor.image} style={styles.doctorImage} />
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>{doctor.name}</Text>
        <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
        {doctor.room && <Text style={styles.doctorRoom}>{doctor.room}</Text>}
        <Text style={styles.doctorPrice}>{doctor.price}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  doctorCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border
  },
  doctorImage: {
    width: 80, 
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  doctorInfo: {
    flex: 1,
    flexDirection: 'column',
    gap: 3,
    justifyContent: 'center',
  },
  doctorName: {
    fontSize: 18,
    color: colors.base600,
    fontFamily: fontFamily.bold,
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: fontFamily.medium,
    marginBottom: 4,
  },
  doctorRoom: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: fontFamily.medium,
    marginBottom: 4,
  },
  doctorPrice: {
    fontSize: 16,
    fontFamily: fontFamily.bold,
    color: colors.base600,
  },
});