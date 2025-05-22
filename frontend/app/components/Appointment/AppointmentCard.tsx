import type React from "react"
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { Appointment } from "../../screens/Appointment/type"
import { useNavigation } from "@react-navigation/native"
import { useFont, fontFamily } from '../../context/FontContext';

interface AppointmentCardProps {
  appointment: Appointment
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
  const { fontsLoaded } = useFont();
  const { date, time, doctorName, specialty, imageUrl, status } = appointment
  const navigation = useNavigation()

  const handlePress = () => {
    if (status === "upcoming") {
      navigation.navigate("AppointmentDetail", { appointment })
    } else {
      navigation.navigate("CompletedAppointmentDetail", { appointment })
    }
  }

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <View style={styles.verticalLine} />
        <Text style={styles.cardHeaderText}>Thông tin lịch khám</Text>
      </View>

      <View style={styles.appointmentTime}>
        <Ionicons name="time-outline" size={20} color="#000" />
        <Text style={styles.appointmentTimeText}>
          {date} • {time}
        </Text>
      </View>

      <View style={styles.separator} />

      <View style={styles.doctorInfo}>
        <Image source={{ uri: imageUrl || "/placeholder.svg?height=60&width=60" }} style={styles.doctorImage} />
        <View style={styles.doctorDetails}>
          <Text style={styles.doctorName}>{doctorName}</Text>
          <Text style={styles.doctorSpecialty}>{specialty}</Text>
        </View>
        {status === "completed" && (
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Đã khám</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  verticalLine: {
    width: 4,
    height: 20,
    backgroundColor: "#0BC5C5",
    borderRadius: 2,
    marginRight: 8,
  },
  cardHeaderText: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: "#6B7280",
  },
  appointmentTime: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  appointmentTimeText: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    marginLeft: 8,
  },
  separator: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginBottom: 16,
  },
  doctorInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E5E7EB",
  },
  doctorDetails: {
    flex: 1,
    marginLeft: 12,
  },
  doctorName: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: "#6B7280",
  },
  statusBadge: {
    backgroundColor: "#E6F7F7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: "#0BC5C5",
  },
})

export default AppointmentCard