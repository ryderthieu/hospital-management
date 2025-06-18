import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import type { RootStackParamList, Appointment, AppointmentResponseDto } from "./type";
import { useFont, fontFamily } from "../../context/FontContext";
import { useState, useEffect } from "react";
import API from "../../services/api";
import { useAlert } from '../../context/AlertContext';

type CompletedAppointmentDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "CompletedAppointmentDetail"
>;

const CompletedAppointmentDetailScreen = () => {
  const { fontsLoaded } = useFont();
  const navigation = useNavigation();
  const route = useRoute<CompletedAppointmentDetailScreenRouteProp>();
  const appointmentId = route.params?.appointment?.id;
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showAlert } = useAlert();

  useEffect(() => {
    if (!appointmentId) {
      showAlert({ title: 'Lỗi', message: 'Không tìm thấy thông tin cuộc hẹn.', onConfirm: () => navigation.goBack() });
      setIsLoading(false);
      return;
    }

    const fetchAppointment = async () => {
      try {
        console.log("[CompletedAppointmentDetailScreen] Fetching appointment:", appointmentId);
        const response = await API.get<AppointmentResponseDto>(`/appointments/${appointmentId}`);
        console.log("[CompletedAppointmentDetailScreen] API response:", JSON.stringify(response.data, null, 2));

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
          status: "completed",
          department: doctorInfo.specialization,
          room: `${schedule.roomNote || "Phòng chưa xác định"} - Tầng ${schedule.floor || "X"} ${schedule.building || ""}`,
          queueNumber: response.data.number,
          patientName: response.data.patientInfo?.fullName || "Bệnh nhân chưa cung cấp",
          patientBirthday: response.data.patientInfo?.birthday || "Không xác định",
          patientGender: response.data.patientInfo?.gender || "Không xác định",
          patientLocation: response.data.patientInfo?.address || "Không xác định",
          appointmentFee: "200.000 VND",
          examTime: `${response.data.slotStart.slice(0, 5)} - ${response.data.slotEnd.slice(0, 5)}`,
          followUpDate: new Date(new Date(response.data.createdAt).getTime() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
          diagnosis: response.data.appointmentNotes
            ? response.data.appointmentNotes.filter((note) => note.noteType === "DIAGNOSIS").map((note) => note.content || "Chưa có chẩn đoán")
            : ["Chưa có chẩn đoán"],
          doctorNotes: response.data.appointmentNotes
            ? response.data.appointmentNotes.filter((note) => note.noteType === "NOTE").map((note) => note.content || "Chưa có ghi chú")
            : ["Chưa có ghi chú"],
          testResults: response.data.appointmentNotes
            ? response.data.appointmentNotes.filter((note) => note.noteType === "TEST_RESULT").map((note, index) => ({
                name: `Kết quả xét nghiệm ${index + 1}`,
                fileUrl: note.content || "/placeholder.pdf",
              }))
            : [],
          codes: {
            appointmentCode: response.data.appointmentId.toString(),
            transactionCode: `TX${response.data.appointmentId}`,
            patientCode: response.data.patientInfo?.patientId.toString() || "N/A",
          },
        };

        setAppointment(appointmentData);
      } catch (error: any) {
        console.error("[CompletedAppointmentDetailScreen] Error fetching appointment:", error.message, error.response?.data);
        showAlert({ title: 'Lỗi', message: 'Không thể tải chi tiết cuộc hẹn. Vui lòng thử lại.', onConfirm: () => navigation.goBack() });
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
          <Text style={styles.headerTitle}>Kết quả</Text>
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
        <Text style={styles.headerTitle}>Kết quả</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>PHIẾU KẾT QUẢ</Text>

          <View style={styles.codeSection}>
            <Text style={styles.codeText}>
              Mã phiếu: {appointment.codes?.appointmentCode || "N/A"}
            </Text>
            <Text style={styles.codeText}>
              Mã BN: {appointment.codes?.patientCode || "N/A"}
            </Text>
            <Text style={styles.codeText}>
              Khám: {appointment.examTime || "N/A"} ({appointment.date.split(", ")[1] || "N/A"})
            </Text>
          </View>

          <View style={styles.compactInfoSection}>
            <View style={styles.infoGroup}>
              <Text style={styles.groupTitle}>Bác sĩ</Text>
              <Text style={styles.doctorName}>{appointment.doctorName}</Text>
              <Text style={styles.specialty}>{appointment.specialty}</Text>
            </View>

            <View style={styles.infoGroup}>
              <Text style={styles.groupTitle}>Bệnh nhân</Text>
              <Text style={styles.patientName}>{appointment.patientName}</Text>
              <Text style={styles.followUpInfo}>Tái khám: {appointment.followUpDate}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chẩn đoán</Text>
            {appointment.diagnosis?.map((item, index) => (
              <Text key={index} style={styles.diagnosisText}>
                {index + 1}. {item}
              </Text>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ghi chú bác sĩ</Text>
            {appointment.doctorNotes?.map((note, index) => (
              <View key={index} style={styles.noteItem}>
                <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                <Text style={styles.noteText}>{note}</Text>
              </View>
            ))}
          </View>

          <View style={styles.lastSection}>
            <Text style={styles.sectionTitle}>Kết quả & Toa thuốc</Text>
            <View style={styles.filesList}>
              {appointment.testResults?.map((result, index) => (
                <TouchableOpacity key={index} style={styles.fileItem}>
                  <Image
                    source={require("../../assets/images/logo/Logo.png")}
                    style={styles.fileIcon}
                  />
                  <Text style={styles.fileName}>{result.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
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
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 22,
    color: "#0BC5C5",
    textAlign: "center",
    marginBottom: 12,
  },
  codeSection: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  codeText: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 2,
  },
  compactInfoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  infoGroup: {
    flex: 1,
  },
  groupTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: "#0BC5C5",
    marginBottom: 6,
  },
  doctorName: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    marginBottom: 4,
  },
  specialty: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: "#6B7280",
  },
  patientName: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    marginBottom: 4,
  },
  followUpInfo: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: "#6B7280",
  },
  section: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  lastSection: {
    marginBottom: 0,
  },
  sectionTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: "#0BC5C5",
    marginBottom: 8,
  },
  diagnosisText: {
    fontFamily: fontFamily.regular,
    fontSize: 15,
    marginBottom: 4,
    lineHeight: 20,
  },
  noteItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  noteText: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  filesList: {
    flexDirection: "row",
    marginTop: 4,
  },
  fileItem: {
    alignItems: "center",
    marginRight: 20,
  },
  fileIcon: {
    width: 50,
    height: 50,
    marginBottom: 6,
  },
  fileName: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: "#4B5563",
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

export default CompletedAppointmentDetailScreen;