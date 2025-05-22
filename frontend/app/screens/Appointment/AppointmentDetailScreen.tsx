import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, ScrollView } from "react-native"
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import type { RootStackParamList } from "./type"
import { useFont, fontFamily } from "../../context/FontContext"
type AppointmentDetailScreenRouteProp = RouteProp<RootStackParamList, "AppointmentDetail">

const AppointmentDetailScreen = () => {
    const { fontsLoaded } = useFont()
  const navigation = useNavigation()
  const route = useRoute<AppointmentDetailScreenRouteProp>()

  const appointment = route.params?.appointment || {
    id: "1",
    date: "Thứ 4, 28/04/2024",
    time: "8:00 - 8:30 AM",
    doctorName: "ThS BS. Trần Ngọc Anh Thơ",
    specialty: "Da khoa",
    imageUrl: "/placeholder.svg?height=60&width=60",
    status: "upcoming",
    department: "Da khoa",
    room: "Phòng 45 - Tầng 2 Khu A",
    queueNumber: 12,
    patientName: "LÊ THIỆN NHI",
    patientBirthday: "28/04/2004",
    patientGender: "Nữ",
    patientLocation: "Cà Mau",
    appointmentFee: "150.000 VND",
    codes: {
      appointmentCode: "312893713",
      transactionCode: "31283781293713",
      patientCode: "47298347293847",
    },
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>PHIẾU KHÁM BỆNH</Text>

          <View style={styles.codeSection}>
            <Text style={styles.codeText}>Mã phiếu: {appointment.codes.appointmentCode}</Text>
            <Text style={styles.codeText}>Mã giao dịch: {appointment.codes.transactionCode}</Text>
            <Text style={styles.codeText}>Mã bệnh nhân: {appointment.codes.patientCode}</Text>
          </View>

          <Text style={styles.departmentName}>{appointment.department}</Text>
          <Text style={styles.roomInfo}>{appointment.room}</Text>

          <View style={styles.queueNumberContainer}>
            <View style={styles.queueNumberCircle}>
              <Text style={styles.queueNumber}>{appointment.queueNumber}</Text>
              <Text style={styles.queueLabel}>STT</Text>
            </View>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Họ tên:</Text>
              <Text style={styles.infoValue}>{appointment.patientName}</Text>
            </View>

            <View style={styles.infoRowSplit}>
              <View style={styles.infoRowHalf}>
                <Text style={styles.infoLabel}>Ngày sinh:</Text>
                <Text style={styles.infoValue}>{appointment.patientBirthday}</Text>
              </View>
              <View style={styles.infoRowHalf}>
                <Text style={styles.infoLabel}>Giới tính:</Text>
                <Text style={styles.infoValue}>{appointment.patientGender}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tỉnh/Thành phố:</Text>
              <Text style={styles.infoValue}>{appointment.patientLocation}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ngày khám:</Text>
              <Text style={styles.infoValue}>{appointment.date} (Buổi chiều)</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Giờ khám (dự kiến):</Text>
              <Text style={styles.infoValue}>{appointment.time}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phí đặt hẹn:</Text>
              <Text style={[styles.infoValue, styles.feeText]}>{appointment.appointmentFee}</Text>
            </View>
          </View>

          <View style={styles.noteSection}>
            <Text style={styles.noteText}>
              Vui lòng đến trực tiếp phòng khám trước thời gian hẹn 15 - 30 phút để khám bệnh.
            </Text>
            <Text style={styles.disclaimerText}>Lưu ý: Số thứ tự này chỉ có giá trị sử dụng trong ngày.</Text>
          </View>
        </View>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="calendar-outline" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Đổi lịch hẹn</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.cancelButton]}>
            <Ionicons name="close-circle-outline" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Hủy lịch hẹn</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 24,
    color: "#0BC5C5",
    textAlign: "center",
    marginBottom: 16,
  },
  codeSection: {
    marginBottom: 24,
  },
  codeText: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 4,
  },
  departmentName: {
    fontFamily: fontFamily.bold,
    fontSize: 22,
    color: "#0BC5C5",
    textAlign: "center",
    marginBottom: 4,
  },
  roomInfo: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: "#4B5563",
    textAlign: "center",
    marginBottom: 20,
  },
  queueNumberContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  queueNumberCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#0BC5C5",
    backgroundColor: "#E6F7F7",
    justifyContent: "center",
    alignItems: "center",
  },
  queueNumber: {
    fontFamily: fontFamily.bold,
    fontSize: 32,
    color: "#0BC5C5",
  },
  queueLabel: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: "#0BC5C5",
  },
  infoSection: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  infoRowSplit: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoRowHalf: {
    flexDirection: "row",
    width: "48%",
  },
  infoLabel: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: "#4B5563",
    marginRight: 4,
  },
  infoValue: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: "#111827",
  },
  feeText: {
    color: "#0BC5C5",
  },
  noteSection: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 16,
  },
  noteText: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: "#4B5563",
    textAlign: "center",
    marginBottom: 8,
  },
  disclaimerText: {
    fontFamily: fontFamily.lightItalic,
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0BC5C5",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: "48%",
  },
  cancelButton: {
    backgroundColor: "#EF4444",
  },
  actionButtonText: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: "#FFFFFF",
    marginLeft: 8,
  },
})

export default AppointmentDetailScreen
