import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import type { RootStackParamList, Appointment, AppointmentResponseDto } from "./type";
import { useFont, fontFamily } from "../../context/FontContext";
import { useState, useEffect } from "react";
import API from "../../services/api";

type AppointmentDetailScreenRouteProp = RouteProp<RootStackParamList, "AppointmentDetail">;

const AppointmentDetailScreen = () => {
  const { fontsLoaded } = useFont();
  const navigation = useNavigation();
  const route = useRoute<AppointmentDetailScreenRouteProp>();
  const appointmentId = route.params?.appointment?.id;
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!appointmentId) {
      Alert.alert("Lỗi", "Không tìm thấy thông tin cuộc hẹn.", [{ text: "OK", onPress: () => navigation.goBack() }]);
      setIsLoading(false);
      return;
    }

    const fetchAppointment = async () => {
      try {
        console.log("[AppointmentDetailScreen] Fetching appointment:", appointmentId);
        const response = await API.get<AppointmentResponseDto>(`/appointments/${appointmentId}`);
        console.log("[AppointmentDetailScreen] API response:", JSON.stringify(response.data, null, 2));

        let doctorInfo = response.data.doctorInfo;
        if (!doctorInfo) {
          const doctorResponse = await API.get(`/doctors/${response.data.doctorId}`);
          doctorInfo = doctorResponse.data;
        }

        const scheduleResponse = await API.get(`/doctors/schedules/${response.data.schedule?.scheduleId || ""}`);
        const schedule = scheduleResponse.data;

        const workDate = new Date(response.data.createdAt).toLocaleDateString("vi-VN", {
          weekday: "long",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });

        const appointmentData: Appointment = {
          id: response.data.appointmentId.toString(),
          date: workDate,
          time: `${response.data.slotStart.slice(0, 5)} - ${response.data.slotEnd.slice(0, 5)}`,
          doctorName: `${doctorInfo.academicDegree || ""} ${doctorInfo.fullName || "Bác sĩ chưa có tên"}`.trim(),
          specialty: doctorInfo.specialization || "Chưa xác định",
          imageUrl: "https://via.placeholder.com/60",
          status: "upcoming",
          department: doctorInfo.specialization,
          room: `${schedule.roomNote || "Phòng chưa xác định"} - Tầng ${schedule.floor || "X"} ${schedule.building || ""}`,
          queueNumber: response.data.number,
          patientName: response.data.patientInfo?.fullName || "Bệnh nhân chưa cung cấp",
          patientBirthday: response.data.patientInfo?.birthday || "Không xác định",
          patientGender: response.data.patientInfo?.gender || "Không xác định",
          patientLocation: response.data.patientInfo?.address || "Không xác định",
          appointmentFee: "150.000 VND",
          codes: {
            appointmentCode: response.data.appointmentId.toString(),
            transactionCode: `TX${response.data.appointmentId}`,
            patientCode: response.data.patientInfo?.patientId.toString() || "N/A",
          },
        };

        setAppointment(appointmentData);
      } catch (error: any) {
        console.error("[AppointmentDetailScreen] Error fetching appointment:", error.message, error.response?.data);
        Alert.alert("Lỗi", "Không thể tải chi tiết cuộc hẹn. Vui lòng thử lại.", [{ text: "OK", onPress: () => navigation.goBack() }]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  if (!fontsLoaded || isLoading || !appointment) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          {isLoading ? (
            <>
              <ActivityIndicator size="large" color="#0BC5C5" />
              <Text style={styles.loadingText}>Đang tải chi tiết cuộc hẹn...</Text>
            </>
          ) : (
            <Text style={styles.loadingText}>Không tìm thấy thông tin cuộc hẹn.</Text>
          )}
        </View>
      </SafeAreaView>
    );
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
            <Text style={styles.codeText}>Mã phiếu: {appointment.codes?.appointmentCode}</Text>
            <Text style={styles.codeText}>Mã giao dịch: {appointment.codes?.transactionCode}</Text>
            <Text style={styles.codeText}>Mã bệnh nhân: {appointment.codes?.patientCode}</Text>
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
      </ScrollView>
    </SafeAreaView>
  );
};

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
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    marginRight: 8,
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
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: "#6B7280",
    marginTop: 8,
  },
});

export default AppointmentDetailScreen;