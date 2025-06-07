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

          {/* Compact Code Section */}
          <View style={styles.codeSection}>
            <Text style={styles.codeText}>
              Mã phiếu: {appointment.codes?.appointmentCode || "312893713"}
            </Text>
            <Text style={styles.codeText}>
              Mã BN: {appointment.codes?.patientCode || "47298347293847"}
            </Text>
            <Text style={styles.codeText}>
              Khám: {appointment.examTime || "14:00 - 15:30"} ({appointment.date.split(", ")[1] || "23/04/2024"})
            </Text>
          </View>

          {/* Compact Doctor & Patient Info */}
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

          {/* Diagnosis */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chẩn đoán</Text>
            {appointment.diagnosis.map((item, index) => (
              <Text key={index} style={styles.diagnosisText}>
                {index + 1}. {item}
              </Text>
            ))}
          </View>

          {/* Doctor Notes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ghi chú bác sĩ</Text>
            {appointment.doctorNotes.map((note, index) => (
              <View key={index} style={styles.noteItem}>
                <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                <Text style={styles.noteText}>{note}</Text>
              </View>
            ))}
          </View>

          {/* Files */}
          <View style={styles.lastSection}>
            <Text style={styles.sectionTitle}>Kết quả & Toa thuốc</Text>
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
});

export default CompletedAppointmentDetailScreen;