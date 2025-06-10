import type React from "react"
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { fontFamily } from "../../../context/FontContext"
import Header from "../../../components/Header"
import type { RootStackParamList } from "../type"
import { LinearGradient } from "expo-linear-gradient"
import { useAuth } from "../../../context/AuthContext"
import { useEffect } from "react"
import API from "../../../services/api"

const HealthProfileScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, "HealthProfile">>()
  const { patient, setPatient, user } = useAuth()

  // Fetch health profile when component mounts if patient data is not available
  useEffect(() => {
    const fetchHealthProfile = async () => {
      if (!user?.userId || patient) {
        return
      }
      try {
        const response = await API.get(`/patients/users/${user.userId}`)
        const fetchedPatient = response.data
        setPatient(fetchedPatient)
      } catch (error: any) {
        console.error("Error fetching health profile:", error)
      }
    }

    fetchHealthProfile()
  }, [user, patient, setPatient])

  // Calculate BMI
  const height = patient?.height ? patient.height / 100 : 0 // convert cm to m
  const weight = patient?.weight || 0
  const bmi = height > 0 ? Number.parseFloat((weight / (height * height)).toFixed(1)) : 0

  // Determine BMI status and position on scale
  const getBmiStatus = (bmiValue: number) => {
    if (bmiValue < 18.5) return "Thiếu cân"
    if (bmiValue < 25) return "Bạn khỏe mạnh"
    if (bmiValue < 30) return "Thừa cân"
    return "Béo phì"
  }

  const getBmiColor = (bmiValue: number) => {
    if (bmiValue < 18.5) return "#5BC0DE" // blue for underweight
    if (bmiValue < 25) return "#5CB85C" // green for normal
    if (bmiValue < 30) return "#F0AD4E" // yellow for overweight
    return "#D9534F" // red for obese
  }

  // Calculate position on BMI scale (15-40)
  const getBmiPosition = (bmiValue: number) => {
    const min = 15
    const max = 40
    const position = ((bmiValue - min) / (max - min)) * 100
    return Math.max(0, Math.min(100, position)) + "%"
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header
        title="Hồ sơ sức khỏe"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showAction={true}
        actionType="edit"
        onActionPress={() => {
          navigation.navigate("EditHealthProfile")
        }}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* BMI Card */}
        <View style={styles.bmiCard}>
          <Text style={styles.bmiTitle}>Body Mass Index (BMI)</Text>

          <View style={styles.bmiValueContainer}>
            <Text style={styles.bmiValue}>{bmi}</Text>
            <View style={styles.bmiStatusContainer}>
              <Text style={styles.bmiStatus}>{getBmiStatus(bmi)}</Text>
            </View>
          </View>

          <View style={styles.bmiScaleContainer}>
            <LinearGradient
              colors={["#5BC0DE", "#5CB85C", "#F0AD4E", "#D9534F"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.bmiScale}
            />
            <View style={[styles.bmiIndicator, { left: getBmiPosition(bmi) }]} />

            <View style={styles.bmiLabels}>
              <Text style={styles.bmiLabel}>15</Text>
              <Text style={styles.bmiLabel}>18.5</Text>
              <Text style={styles.bmiLabel}>25</Text>
              <Text style={styles.bmiLabel}>30</Text>
              <Text style={styles.bmiLabel}>40</Text>
            </View>
          </View>
        </View>

        {/* Height and Weight Cards */}
        <View style={styles.metricsContainer}>
          <View style={[styles.metricCard, { backgroundColor: "#FBE7D2" }]}>
            <Text style={styles.metricLabel}>Chiều cao</Text>
            <View style={styles.metricValueContainer}>
              <View style={styles.metricScale}>
                {[...Array(9)].map((_, i) => (
                  <View key={i} style={[styles.metricTick, i === 4 && { backgroundColor: "#E57373" }]} />
                ))}
              </View>
              <Text style={styles.metricValue}>{patient?.height || 0} cm</Text>
            </View>
          </View>

          <View style={[styles.metricCard, { backgroundColor: "#E0F7FA" }]}>
            <Text style={styles.metricLabel}>Cân nặng</Text>
            <View style={styles.metricValueContainer}>
              <View style={styles.metricScale}>
                {[...Array(9)].map((_, i) => (
                  <View key={i} style={[styles.metricTick, i === 4 && { backgroundColor: "#E57373" }]} />
                ))}
              </View>
              <Text style={styles.metricValue}>{patient?.weight || 0} kg</Text>
            </View>
          </View>
        </View>

        {/* Allergies Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dị ứng</Text>
          <View style={styles.allergiesContainer}>
            {patient?.allergies?.split(",").filter(allergy => allergy.trim()).map((allergy, index) => (
              <View key={index} style={styles.allergyTag}>
                <Text style={styles.allergyText}>{allergy.trim()}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Blood Type Section */}
        {patient?.bloodType && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nhóm máu</Text>
            <View style={styles.allergiesContainer}>
              <View style={styles.allergyTag}>
                <Text style={styles.allergyText}>{patient.bloodType}</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  bmiCard: {
    backgroundColor: "#4A4A4A",
    borderRadius: 15,
    padding: 20,
    marginTop: 15,
    marginBottom: 15,
  },
  bmiTitle: {
    fontFamily: fontFamily.medium,
    fontSize: 18,
    color: "#FFFFFF",
    marginBottom: 15,
  },
  bmiValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  bmiValue: {
    fontFamily: fontFamily.bold,
    fontSize: 40,
    color: "#FFFFFF",
  },
  bmiStatusContainer: {
    backgroundColor: "#E0F7E0",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bmiStatus: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: "#2E7D32",
  },
  bmiScaleContainer: {
    position: "relative",
    height: 40,
  },
  bmiScale: {
    height: 8,
    borderRadius: 4,
    width: "100%",
  },
  bmiIndicator: {
    position: "absolute",
    top: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    marginLeft: -8,
    top: -4,
  },
  bmiLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  bmiLabel: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: "#FFFFFF",
  },
  metricsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  metricCard: {
    width: "48%",
    borderRadius: 15,
    padding: 15,
  },
  metricLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: "#212121",
    marginBottom: 10,
  },
  metricValueContainer: {
    alignItems: "center",
  },
  metricScale: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 10,
  },
  metricTick: {
    width: 2,
    height: 15,
    backgroundColor: "#757575",
  },
  metricValue: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
    color: "#212121",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: "#212121",
    marginBottom: 10,
  },
  allergiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  allergyTag: {
    backgroundColor: "#E0F7FA",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  allergyText: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: "#00838F",
  },
  bottomSpace: {
    height: 30,
  },
})

export default HealthProfileScreen