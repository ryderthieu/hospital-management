"use client"

import type React from "react"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, ScrollView } from "react-native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RouteProp } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import type { RootStackParamList, AppointmentDetail } from "../types"
import { colors } from "../../../styles/globalStyles"
import { useFont, fontFamily } from "../../../context/FontContext"

type PaymentSuccessScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "PaymentSuccess">
  route: RouteProp<RootStackParamList, "PaymentSuccess">
}

export const PaymentSuccessScreen: React.FC<PaymentSuccessScreenProps> = ({ navigation, route }) => {
  const { fontsLoaded } = useFont()
  const {
    doctor,
    selectedDate,
    selectedTime,
    transactionId,
    selectedSymptoms = [],
    hasInsurance = false,
  } = route.params

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const days = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"]
    const dayName = days[date.getDay()]
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    return `${dayName}, ${day}/${month}/${year}`
  }

  const generateAppointmentData = (): AppointmentDetail => {
    const appointmentCode = `APT${Date.now().toString().slice(-6)}`
    const patientCode = `PT${Math.random().toString(36).substr(2, 8).toUpperCase()}`

    return {
      id: appointmentCode,
      date: formatDate(selectedDate),
      time: selectedTime,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      imageUrl: "/placeholder.svg?height=60&width=60", // Placeholder for now
      status: "confirmed",
      department: doctor.specialty,
      room: doctor.room || "Phòng 66 - Lầu 1 Khu B",
      queueNumber: Math.floor(Math.random() * 50) + 1, // Random queue number
      patientName: "NGUYỄN VĂN A", // Mock patient name - in real app this would come from user profile
      patientBirthday: "01/01/1990", // Mock birthday
      patientGender: "Nam", // Mock gender
      patientLocation: "TP. Hồ Chí Minh", // Mock location
      appointmentFee: doctor.price,
      codes: {
        appointmentCode: appointmentCode,
        transactionCode: transactionId,
        patientCode: patientCode,
      },
    }
  }

  const handleViewDetails = () => {
    // Create appointment data and navigate to existing AppointmentDetailScreen
    const appointmentData = generateAppointmentData()

    navigation.navigate("AppointmentDetail", {
      appointment: appointmentData,
      doctor,
      selectedDate,
      selectedTime,
      transactionId,
      selectedSymptoms,
      hasInsurance,
    })
  }

  const handleBackToHome = () => {
    navigation.navigate("Home")
  }

  if (!fontsLoaded) {
    return null
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Success Icon */}
      <View style={styles.iconContainer}>
        <View style={styles.iconBackground}>
          <Ionicons name="checkmark" size={40} color="#00B5B8" />
        </View>
      </View>

      {/* Success Content */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={[styles.title, { fontFamily: fontFamily.bold }]}>Bạn đã đặt lịch hẹn thành công</Text>

        {/* Subtitle */}
        <Text style={[styles.subtitle, { fontFamily: fontFamily.regular }]}>
          Xác nhận lịch hẹn đã được gửi đến email của bạn.
        </Text>

        {/* Doctor Information */}
        <View style={styles.doctorSection}>
          <Image source={doctor.image} style={styles.doctorImage} />
          <Text style={[styles.doctorName, { fontFamily: fontFamily.bold }]}>{doctor.name}</Text>
          <Text style={[styles.doctorSpecialty, { fontFamily: fontFamily.regular }]}>{doctor.specialty}</Text>
        </View>

        {/* Appointment Details */}
        <View style={styles.appointmentSection}>
          <View style={styles.appointmentItem}>
            <View style={styles.calendarIcon}>
              <Ionicons name="calendar" size={24} color="#00BCD4" />
            </View>
            <View style={styles.appointmentInfo}>
              <Text style={[styles.appointmentLabel, { fontFamily: fontFamily.medium }]}>Lịch hẹn</Text>
              <Text style={[styles.appointmentDate, { fontFamily: fontFamily.bold }]}>{formatDate(selectedDate)}</Text>
              <Text style={[styles.appointmentTime, { fontFamily: fontFamily.regular }]}>
                {selectedTime} - {doctor.room}
              </Text>
            </View>
          </View>
        </View>

        {/* Transaction ID */}
        {transactionId && (
          <View style={styles.transactionSection}>
            <Text style={[styles.transactionLabel, { fontFamily: fontFamily.regular }]}>Mã giao dịch:</Text>
            <Text style={[styles.transactionId, { fontFamily: fontFamily.medium }]}>{transactionId}</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.detailsButton} onPress={handleViewDetails} activeOpacity={0.8}>
            <Text style={[styles.detailsButtonText, { fontFamily: fontFamily.bold }]}>
              Xem chi tiết Phiếu khám bệnh
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.homeButton} onPress={handleBackToHome} activeOpacity={0.7}>
            <Text style={[styles.homeButtonText, { fontFamily: fontFamily.medium }]}>Về trang chủ</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary, 
  },
  iconContainer: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 40,
  },
  iconBackground: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    minHeight: "100%", // Ensure content takes full height
  },
  title: {
    fontSize: 24,
    color: colors.text,
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },
  doctorSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginBottom: 16,
  },
  doctorName: {
    fontSize: 20,
    color: colors.text,
    marginBottom: 4,
    textAlign: "center",
  },
  doctorSpecialty: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
  },
  appointmentSection: {
    marginBottom: 32,
  },
  appointmentItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#E0F7FA", // Light teal background
    borderRadius: 16,
    padding: 20,
  },
  calendarIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  appointmentDate: {
    fontSize: 18,
    color: colors.text,
    marginBottom: 4,
  },
  appointmentTime: {
    fontSize: 16,
    color: colors.text,
  },
  transactionSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.base50,
    borderRadius: 12,
    marginBottom: 32,
  },
  transactionLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  transactionId: {
    fontSize: 14,
    color: colors.text,
  },
  actionButtonsContainer: {
    marginTop: 40, // Add margin instead of using spacer
    paddingBottom: 20,
  },
  detailsButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 2,
  },
  detailsButtonText: {
    fontSize: 16,
    color: colors.white,
    textAlign: "center",
  },
  homeButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  homeButtonText: {
    fontSize: 16,
    color: colors.primary,
    textAlign: "center",
  },
})
