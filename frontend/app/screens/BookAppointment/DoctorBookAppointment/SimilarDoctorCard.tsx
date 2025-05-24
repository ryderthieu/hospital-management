"use client"

import type React from "react"
import { memo } from "react"
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { Doctor } from "../types"
import { colors } from "../../../styles/globalStyles"
import { useFont, fontFamily } from "../../../context/FontContext"

interface SimilarDoctorCardProps {
  doctor: Doctor
  onPress?: () => void
  showRating?: boolean
}

export const SimilarDoctorCard: React.FC<SimilarDoctorCardProps> = memo(({ doctor, onPress, showRating = false }) => {
  const { fontsLoaded } = useFont()

  const handlePress = () => {
    onPress?.()
  }

  if (!fontsLoaded) {
    return null
  }

  const CardContent = (
    <View style={styles.similarDoctorCard}>
      <View style={styles.imageContainer}>
        <Image source={doctor.image} style={styles.similarDoctorImage} resizeMode="cover" />
      </View>

      <View style={styles.doctorInfo}>
        <Text style={[styles.similarDoctorName, { fontFamily: fontFamily.bold }]} numberOfLines={2}>
          {doctor.name}
        </Text>

        <View style={styles.specialtyContainer}>
          <Ionicons name="medical-outline" size={12} color={colors.textSecondary} />
          <Text style={[styles.similarDoctorSpecialty, { fontFamily: fontFamily.medium }]}>{doctor.specialty}</Text>
        </View>

        {doctor.room && (
          <View style={styles.roomContainer}>
            <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
            <Text style={[styles.roomText, { fontFamily: fontFamily.medium }]} numberOfLines={1}>
              {doctor.room}
            </Text>
          </View>
        )}

        <View style={styles.priceContainer}>
          <Text style={[styles.priceLabel, { fontFamily: fontFamily.medium }]}>Phí khám:</Text>
          <Text style={[styles.similarDoctorPrice, { fontFamily: fontFamily.bold }]}>{doctor.price}</Text>
        </View>
      </View>

      {onPress && (
        <View style={styles.actionIndicator}>
          <Ionicons name="chevron-forward" size={16} color={colors.primary} />
        </View>
      )}
    </View>
  )

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`Xem thông tin bác sĩ ${doctor.name}`}
      >
        {CardContent}
      </TouchableOpacity>
    )
  }

  return CardContent
})

SimilarDoctorCard.displayName = "SimilarDoctorCard"

const styles = StyleSheet.create({
  similarDoctorCard: {
    width: 180, // Fixed width for horizontal scrolling instead of '48%'
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginRight: 12, // Right margin for horizontal spacing
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    position: "relative",
    minHeight: 220, // Ensure consistent height for horizontal layout
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 12,
    position: "relative",
  },
  similarDoctorImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.base100,
  },
  statusIndicator: {
    position: "absolute",
    bottom: 2,
    right: "35%",
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: colors.white,
  },
  doctorInfo: {
    flex: 1,
    gap: 6,
  },
  similarDoctorName: {
    fontSize: 14,
    color: colors.text,
    textAlign: "center",
    minHeight: 36, // Ensure consistent height
  },
  specialtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  similarDoctorSpecialty: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  roomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  roomText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
    flex: 1,
  },
  priceContainer: {
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  priceLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  similarDoctorPrice: {
    fontSize: 14,
    color: colors.primary,
    textAlign: "center",
  },
  actionIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: colors.base50,
    borderRadius: 12,
    padding: 4,
  },
})
