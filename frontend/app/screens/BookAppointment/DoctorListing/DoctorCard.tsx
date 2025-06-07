import React, { memo } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Doctor } from '../types';
import { colors } from '../../../styles/globalStyles';
import { useFont, fontFamily } from '../../../context/FontContext';

interface DoctorCardProps {
  doctor: Doctor;
  onPress: () => void;
  showFavorite?: boolean;
  isFavorite?: boolean;
  onFavoritePress?: () => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = memo(({ 
  doctor, 
  onPress, 
  showFavorite = false,
  isFavorite = false,
  onFavoritePress 
}) => {
  const { fontsLoaded } = useFont();

  const handleFavoritePress = (e: any) => {
    e.stopPropagation(); // Prevent triggering onPress
    onFavoritePress?.();
  };

  if (!fontsLoaded) {
    return null; // Or skeleton component
  }

  return (
    <TouchableOpacity 
      style={styles.doctorCard} 
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Bác sĩ ${doctor.name}, chuyên khoa ${doctor.specialty}`}
    >
      {/* Doctor Image */}
      <View style={styles.imageContainer}>
        <Image 
          source={doctor.image} 
          style={styles.doctorImage}
          resizeMode="cover"
        />
      </View>

      {/* Doctor Info */}
      <View style={styles.doctorInfo}>
        <View style={styles.nameContainer}>
          <Text 
            style={[styles.doctorName, { fontFamily: fontFamily.bold }]}
            numberOfLines={2}
          >
            {doctor.name}
          </Text>
          {showFavorite && (
            <TouchableOpacity 
              onPress={handleFavoritePress}
              style={styles.favoriteButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={20} 
                color={isFavorite ? colors.error : colors.textSecondary} 
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.infoRow}>
            <Ionicons name="medical-outline" size={14} color={colors.textSecondary} />
            <Text style={[styles.doctorSpecialty, { fontFamily: fontFamily.medium }]}>
              {doctor.specialty}
            </Text>
          </View>

          {doctor.room && (
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
              <Text style={[styles.doctorRoom, { fontFamily: fontFamily.medium }]}>
                {doctor.room}
              </Text>
            </View>
          )}
        </View>

        {/* Price and Action */}
        <View style={styles.bottomRow}>
          <View style={styles.priceContainer}>
            <Text style={[styles.priceLabel, { fontFamily: fontFamily.regular }]}>
              Phí khám:
            </Text>
            <Text style={[styles.doctorPrice, { fontFamily: fontFamily.bold }]}>
              {doctor.price}
            </Text>
          </View>
          
          <View style={styles.actionContainer}>
            <Text style={[styles.actionText, { fontFamily: fontFamily.medium }]}>
              Đặt lịch
            </Text>
            <Ionicons name="chevron-forward" size={16} color={colors.primary} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

DoctorCard.displayName = 'DoctorCard';

const styles = StyleSheet.create({
  doctorCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  doctorImage: {
    width: 80, 
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.base100,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: colors.white,
  },
  doctorInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  doctorName: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  favoriteButton: {
    padding: 4,
  },
  detailsContainer: {
    flex: 1,
    gap: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  doctorRoom: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  rating: {
    fontSize: 13,
    color: colors.textSecondary,
    flex: 1,
  },
  experience: {
    fontSize: 13,
    color: colors.textSecondary,
    flex: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  doctorPrice: {
    fontSize: 16,
    color: colors.primary,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 14,
    color: colors.primary,
  },
});