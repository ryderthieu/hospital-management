import React, { memo } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Doctor } from '../types';
import { colors } from '../../../styles/globalStyles';
import { useFont, fontFamily } from '../../../context/FontContext';

interface DoctorHeaderProps {
  doctor: Doctor;
  showFavorite?: boolean;
  isFavorite?: boolean;
  onFavoritePress?: () => void;
  showStatus?: boolean;
  isOnline?: boolean;
  showActions?: boolean;
  onCallPress?: () => void;
  onMessagePress?: () => void;
}

export const DoctorHeader: React.FC<DoctorHeaderProps> = memo(({
  doctor,
  showFavorite = false,
  isFavorite = false,
  onFavoritePress,
  showStatus = true,
  isOnline = true,
  showActions = false,
  onCallPress,
  onMessagePress
}) => {
  const { fontsLoaded } = useFont();

  const handleFavoritePress = () => {
    onFavoritePress?.();
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.doctorHeaderCard}>
      {/* Doctor Image with Status */}
      <View style={styles.imageContainer}>
        <Image 
          source={doctor.image} 
          style={styles.bookingDoctorImage}
          resizeMode="cover"
        />
      </View>

      {/* Doctor Info */}
      <View style={styles.bookingDoctorInfo}>
        <View style={styles.nameRow}>
          <Text 
            style={[styles.bookingDoctorName, { fontFamily: fontFamily.bold }]}
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

        <View style={styles.infoRow}>
          <Ionicons name="medical-outline" size={14} color={colors.textSecondary} />
          <Text style={[styles.bookingDoctorSpecialty, { fontFamily: fontFamily.medium }]}>
            {doctor.specialty}
          </Text>
        </View>

        {doctor.room && (
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
            <Text style={[styles.bookingDoctorRoom, { fontFamily: fontFamily.medium }]}>
              {doctor.room}
            </Text>
          </View>
        )}

        {/* Price */}
        <View style={styles.priceRow}>
          <Text style={[styles.priceLabel, { fontFamily: fontFamily.medium }]}>
            Phí khám:
          </Text>
          <Text style={[styles.bookingDoctorPrice, { fontFamily: fontFamily.bold }]}>
            {doctor.price}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      {showActions && (
        <View style={styles.actionsContainer}>
          {onCallPress && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={onCallPress}
            >
              <Ionicons name="call" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
          {onMessagePress && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={onMessagePress}
            >
              <Ionicons name="chatbubble" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
});

DoctorHeader.displayName = 'DoctorHeader';

const styles = StyleSheet.create({
  doctorHeaderCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    padding: 16,
    marginBottom: 16,
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
  bookingDoctorImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.base100,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.white,
  },
  bookingDoctorInfo: {
    flex: 1,
    gap: 6,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bookingDoctorName: {
    fontSize: 18,
    color: colors.textSecondary,
    flex: 1,
    marginRight: 8,
  },
  favoriteButton: {
    padding: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bookingDoctorSpecialty: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  bookingDoctorRoom: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  priceLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 8,
  },
  bookingDoctorPrice: {
    fontSize: 16,
    color: colors.primary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  actionsContainer: {
    flexDirection: 'column',
    gap: 8,
    marginLeft: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.base50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
});