import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import type { RootStackParamList } from "./type";
import { useFont, fontFamily } from "../../context/FontContext";

type CompletedAppointmentDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "CompletedAppointmentDetail"
>;

const CompletedAppointmentDetailScreen = () => {
  const { fontsLoaded } = useFont();
  const navigation = useNavigation();
  const route = useRoute<CompletedAppointmentDetailScreenRouteProp>();

  const appointment = route.params?.appointment || {
    id: "4",
    date: "Thứ 2, 15/04/2024",
    time: "9:00 - 9:30 AM",
    doctorName: "BSCKII. TRẦN ĐỖ PHƯƠNG NHI",
    specialty: "Tim mạch",
    imageUrl: "/placeholder.svg?height=60&width=60",
    status: "completed",
    department: "Tim mạch",
    room: "Phòng 32 - Tầng 3 Khu C",
    queueNumber: 5,
    patientName: "LÊ THIỆN NHI",
    patientBirthday: "28/04/2004",
    patientGender: "Nữ",
    patientLocation: "Cà Mau",
    appointmentFee: "200.000 VND",
    examTime: "14:00 - 15:30",
    followUpDate: "30/04/2024",
    diagnosis: ["Hở van tim.", "Có dấu hiệu mỡ trong máu"],
    doctorNotes: [
      "Nên uống nhiều nước hơn",
      "Không hút thuốc",
      "Không suy nghĩ nhiều, giữ đầu óc thư giãn",
    ],
    testResults: [
      {
        name: "File 1",
        fileUrl: "/placeholder.pdf",
      },
      {
        name: "File 2",
        fileUrl: "/placeholder.pdf",
      },
    ],
    codes: {
      appointmentCode: "312893714",
      transactionCode: "31283781293714",
      patientCode: "47298347293847",
    },
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
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
              Mã phiếu: {appointment.codes?.appointmentCode || "312893713"}
            </Text>
            <Text style={styles.codeText}>
              Mã bệnh nhân: {appointment.codes?.patientCode || "47298347293847"}
            </Text>
            <Text style={styles.codeText}>
              Thời gian khám: {appointment.examTime || "14:00 - 15:30"} (
              {appointment.date.split(", ")[1] || "23/04/2024"})
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin bác sĩ</Text>
            <Text style={styles.doctorName}>
              {appointment.doctorName || "BSCKII. TRẦN ĐỖ PHƯƠNG NHI"}
            </Text>
            <View style={styles.specialtyRow}>
              <Text style={styles.specialtyLabel}>Chuyên khoa:</Text>
              <Text style={styles.specialtyValue}>
                {appointment.specialty || "Tim mạch"}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin bệnh nhân</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Họ tên:</Text>
              <Text style={styles.infoValue}>
                {appointment.patientName || "LÊ THIỆN NHI"}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.infoRow}>
              <Text style={[styles.sectionTitle, styles.followUpTitle]}>
                Ngày tái khám:
              </Text>
              <Text style={styles.followUpDate}>
                {appointment.followUpDate || "30/04/2024"}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chẩn đoán bệnh</Text>
            <View style={styles.diagnosisList}>
              {(
                appointment.diagnosis || [
                  "Hở van tim.",
                  "Có dấu hiệu mỡ trong máu",
                ]
              ).map((item, index) => (
                <View key={index} style={styles.diagnosisItem}>
                  <Text style={styles.diagnosisNumber}>{index + 1}.</Text>
                  <Text style={styles.diagnosisText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ghi chú của bác sĩ</Text>
            <View style={styles.notesList}>
              {(
                appointment.doctorNotes || [
                  "Nên uống nhiều nước hơn",
                  "Không hút thuốc",
                  "Không suy nghĩ nhiều, giữ đầu óc thư giãn",
                ]
              ).map((note, index) => (
                <View key={index} style={styles.noteItem}>
                  <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                  <Text style={styles.noteText}>{note}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Kết quả xét nghiệm & Toa thuốc
            </Text>
            <View style={styles.filesList}>
              <TouchableOpacity style={styles.fileItem}>
                <Image
                  source={require("../../assets/images/logo/Logo.png")}
                  style={styles.fileIcon}
                />
                <Text style={styles.fileName}>File 1</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.fileItem}>
                <Image
                  source={require("../../assets/images/logo/Logo.png")}
                  style={styles.fileIcon}
                />
                <Text style={styles.fileName}>File 2</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="calendar-outline" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Đặt lịch tái khám</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.shareButton]}>
            <Ionicons name="share-outline" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Chia sẻ kết quả</Text>
          </TouchableOpacity>
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
    fontFamily: fontFamily.light,
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 4,
  },
  section: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 16,
  },
  sectionTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: "#0BC5C5",
    marginBottom: 12,
  },
  doctorName: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
    marginBottom: 8,
  },
  specialtyRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  specialtyLabel: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: "#4B5563",
    marginRight: 4,
  },
  specialtyValue: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: "#111827",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
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
  followUpTitle: {
    marginBottom: 0,
  },
  followUpDate: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: "#000",
    marginLeft: 8,
  },
  diagnosisList: {
    marginTop: 4,
  },
  diagnosisItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  diagnosisNumber: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    marginRight: 8,
    width: 20,
  },
  diagnosisText: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    flex: 1,
  },
  notesList: {
    marginTop: 4,
  },
  noteItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  noteText: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  filesList: {
    flexDirection: "row",
    marginTop: 8,
  },
  fileItem: {
    alignItems: "center",
    marginRight: 24,
  },
  fileIcon: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  fileName: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: "#4B5563",
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
  shareButton: {
    backgroundColor: "#4B5563",
  },
  actionButtonText: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: "#FFFFFF",
    marginLeft: 8,
  },
});

export default CompletedAppointmentDetailScreen;
