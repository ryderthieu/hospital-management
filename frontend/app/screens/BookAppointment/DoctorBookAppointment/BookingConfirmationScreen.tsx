"use client"

import type React from "react"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Image } from "react-native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RouteProp } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import type { RootStackParamList } from "../types"
import { globalStyles, colors } from "../../../styles/globalStyles"
import Header from "../../../components/Header"
import { useFont, fontFamily } from "../../../context/FontContext"

type BookingConfirmationScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "BookingConfirmation">
  route: RouteProp<RootStackParamList, "BookingConfirmation">
}

export const BookingConfirmationScreen: React.FC<BookingConfirmationScreenProps> = ({ navigation, route }) => {
  const { fontsLoaded } = useFont()
  const { doctor, selectedDate, selectedTime, hasInsurance, selectedSymptoms } = route.params

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const days = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"]
    const dayName = days[date.getDay()]
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    return `${dayName}, ${day}/${month}/${year}`
  }

  const handleEdit = () => {
    navigation.goBack()
  }

  const handleCancel = () => {
    Alert.alert("Hủy đặt hẹn", "Bạn có chắc chắn muốn hủy đặt lịch này không?", [
      { text: "Không", style: "cancel" },
      {
        text: "Hủy",
        style: "destructive",
        onPress: () => {
          navigation.navigate("DoctorList", { specialty: doctor.specialty })
        },
      },
    ])
  }

  const handleSearchMore = () => {
    navigation.navigate("SpecialistSearch")
  }

  const handleContinue = () => {
    // Navigate to payment screen
    navigation.navigate("Payment", {
      doctor,
      selectedDate,
      selectedTime,
      hasInsurance,
      selectedSymptoms,
    })
  }

  if (!fontsLoaded) {
    return null
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <Header title="Đặt lịch hẹn" showBack={true} onBackPress={() => navigation.goBack()} />

      <View style={styles.container}>
        {/* Booking Summary Card */}
        <View style={styles.summaryCard}>
          {/* Doctor Info */}
          <View style={styles.doctorSection}>
            <Image source={doctor.image} style={styles.doctorImage} />
            <View style={styles.doctorInfo}>
              <Text style={[styles.doctorName, { fontFamily: fontFamily.bold }]}>{doctor.name}</Text>
              <Text style={[styles.doctorSpecialty, { fontFamily: fontFamily.regular }]}>{doctor.specialty}</Text>
            </View>
          </View>

          {/* Appointment Details */}
          <View style={styles.detailsSection}>
            {/* Date & Time */}
            <View style={styles.detailItem}>
              <View style={[styles.iconContainer, { backgroundColor: "#E0F7FA" }]}>
                <Ionicons name="calendar" size={20} color="#00BCD4" />
              </View>
              <Text style={[styles.detailText, { fontFamily: fontFamily.medium }]}>
                {formatDate(selectedDate)} - {selectedTime}
              </Text>
            </View>

            {/* Location */}
            <View style={styles.detailItem}>
              <View style={[styles.iconContainer, { backgroundColor: "#E0F7FA" }]}>
                <Ionicons name="location" size={20} color="#00BCD4" />
              </View>
              <Text style={[styles.detailText, { fontFamily: fontFamily.medium }]}>{doctor.room}</Text>
            </View>

            {/* Symptoms */}
            <View style={styles.detailItem}>
              <View style={[styles.iconContainer, { backgroundColor: "#E0F7FA" }]}>
                <Ionicons name="clipboard" size={20} color="#00BCD4" />
              </View>
              <Text style={[styles.detailText, { fontFamily: fontFamily.medium }]}>{selectedSymptoms.join(", ")}</Text>
            </View>

            {/* Insurance */}
            <View style={styles.detailItem}>
              <View style={[styles.iconContainer, { backgroundColor: "#E0F7FA" }]}>
                <Ionicons name="shield-checkmark" size={20} color="#00BCD4" />
              </View>
              <Text style={[styles.detailText, { fontFamily: fontFamily.medium }]}>
                {hasInsurance ? "Có Bảo hiểm y tế" : "Không có bảo hiểm"}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.editButton} onPress={handleEdit} activeOpacity={0.8}>
              <Ionicons name="create" size={18} color={colors.white} />
              <Text style={[styles.editButtonText, { fontFamily: fontFamily.bold }]}>Chỉnh sửa</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel} activeOpacity={0.8}>
              <Ionicons name="trash" size={18} color={colors.white} />
              <Text style={[styles.cancelButtonText, { fontFamily: fontFamily.bold }]}>Hủy đặt hẹn</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Promotional Card */}
        <TouchableOpacity style={styles.promoCard} onPress={handleSearchMore} activeOpacity={0.8}>
          <Text style={[styles.promoText, { fontFamily: fontFamily.medium }]}>
            Bạn có muốn khám thêm ở chuyên khoa khác?
          </Text>
          <Text style={[styles.promoAction, { fontFamily: fontFamily.bold }]}>Tìm kiếm thêm</Text>
        </TouchableOpacity>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={globalStyles.button} onPress={handleContinue} activeOpacity={0.8}>
            <Text style={[globalStyles.buttonText, { fontFamily: fontFamily.bold }]}>Tiếp theo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: colors.base900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  doctorSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  detailsSection: {
    marginBottom: 24,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  detailText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  editButtonText: {
    fontSize: 14,
    color: colors.white,
  },
  cancelButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F44336",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    color: colors.white,
  },
  promoCard: {
    backgroundColor: "#FFF3C4",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFE082",
  },
  promoText: {
    fontSize: 16,
    color: "#F57C00",
    textAlign: "center",
    marginBottom: 8,
  },
  promoAction: {
    fontSize: 16,
    color: "#E65100",
    textDecorationLine: "underline",
  },
  buttonContainer: {
    paddingBottom: 34, 
    paddingTop: 16,
  },
})
