"use client"

import type React from "react"
import { useState, useMemo } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
} from "react-native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RouteProp } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import type { RootStackParamList } from "../types"
import { globalStyles, colors } from "../../../styles/globalStyles"
import Header from "../../../components/Header"
import { DoctorHeader } from "./DoctorHeader"
import { useFont, fontFamily } from "../../../context/FontContext"
import API from "../../../services/api"

type SymptomSelectionScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "SymptomSelection">
  route: RouteProp<RootStackParamList, "SymptomSelection">
}

interface Symptom {
  id: string
  name: string
  category?: string
}

interface AppointmentRequest {
  slotStart: string
  slotEnd: string
  scheduleId: number
  symptoms: string
  doctorId: number
  patientId: number
}

interface AppointmentResponse {
  appointmentId: number
  doctorId: number
  schedule: {
    scheduleId: number
  }
  symptoms: string
  number: number
  SlotStart: string
  SlotEnd: string
  appointmentStatus: string
  createdAt: string
  patientInfo: {
    patientId: number
  }
  appointmentNotes: any[]
}

const symptomsData: Symptom[] = [
  { id: "1", name: "Đau lưng", category: "Cơ xương khớp" },
  { id: "2", name: "Gãy xương", category: "Cơ xương khớp" },
  { id: "3", name: "Cảm lạnh", category: "Hô hấp" },
  { id: "4", name: "Táo bón", category: "Tiêu hóa" },
  { id: "5", name: "Ho", category: "Hô hấp" },
  { id: "6", name: "Tiêu chảy", category: "Tiêu hóa" },
  { id: "7", name: "Chóng mặt", category: "Thần kinh" },
  { id: "8", name: "Đau đầu", category: "Thần kinh" },
  { id: "9", name: "Sốt", category: "Toàn thân" },
  { id: "10", name: "Mệt mỏi", category: "Toàn thân" },
  { id: "11", name: "Đau bụng", category: "Tiêu hóa" },
  { id: "12", name: "Buồn nôn", category: "Tiêu hóa" },
  { id: "13", name: "Khó thở", category: "Hô hấp" },
  { id: "14", name: "Đau ngực", category: "Tim mạch" },
  { id: "15", name: "Hồi hộp", category: "Tim mạch" },
  { id: "16", name: "Mất ngủ", category: "Thần kinh" },
  { id: "17", name: "Lo âu", category: "Tâm lý" },
  { id: "18", name: "Trầm cảm", category: "Tâm lý" },
]

export const SymptomSelectionScreen: React.FC<SymptomSelectionScreenProps> = ({ navigation, route }) => {
  const { fontsLoaded } = useFont()
  const { doctor, selectedDate, selectedTime, hasInsurance, scheduleId, patientId } = route.params

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  // Filter symptoms based on search query
  const filteredSymptoms = useMemo(() => {
    if (!searchQuery.trim()) return symptomsData
    return symptomsData.filter((symptom) => symptom.name.toLowerCase().includes(searchQuery.toLowerCase().trim()))
  }, [searchQuery])

  const handleSymptomToggle = (symptomId: string) => {
    console.log('[SymptomSelectionScreen] Trước khi toggle - selectedSymptoms:', selectedSymptoms)
    setSelectedSymptoms((prev) => {
      const newState = prev.includes(symptomId) ? prev.filter((id) => id !== symptomId) : [...prev, symptomId]
      console.log('[SymptomSelectionScreen] Sau khi toggle - newState:', newState)
      return newState
    })
  }

  const handleContinue = async () => {
  console.log('[SymptomSelectionScreen] selectedSymptoms:', selectedSymptoms);

  if (!Array.isArray(selectedSymptoms) || selectedSymptoms.length === 0) {
    Alert.alert("Thông báo", "Vui lòng chọn ít nhất một triệu chứng.", [{ text: "OK" }]);
    return;
  }

  if (!Array.isArray(symptomsData)) {
    console.error("[SymptomSelectionScreen] symptomsData không phải là mảng:", symptomsData);
    Alert.alert("Lỗi", "Dữ liệu triệu chứng không hợp lệ. Vui lòng thử lại.");
    return;
  }

  // Tạo mảng các tên triệu chứng
  const selectedSymptomNames = symptomsData
    .filter((symptom) => selectedSymptoms.includes(symptom.id))
    .map((symptom) => symptom.name);

  setIsSubmitting(true);
  try {
    const [slotStart, slotEnd] = selectedTime.split(" - ").map((t) => `${t}:00`);
    const appointmentRequest: AppointmentRequest = {
      slotStart,
      slotEnd,
      scheduleId,
      symptoms: selectedSymptomNames.join(", "),
      doctorId: parseInt(doctor.id),
      patientId,
    };

    console.log('[SymptomSelectionScreen] Tạo cuộc hẹn với:', JSON.stringify(appointmentRequest, null, 2));
    const responseAppt = await API.post<AppointmentResponse>("/appointments", appointmentRequest);
    console.log('[SymptomSelectionScreen] Cuộc hẹn đã tạo:', JSON.stringify(responseAppt.data, null, 2));

    navigation.navigate("BookingConfirmation", {
      doctor,
      selectedDate,
      selectedTime,
      hasInsurance,
      selectedSymptoms: selectedSymptomNames,
      location: responseAppt.data.schedule.location,
    });
  } catch (error: any) {
    console.error("[SymptomSelectionScreen] Lỗi khi tạo cuộc hẹn:", error.message, error.response?.data);
    Alert.alert(
      "Lỗi",
      error.response?.data?.message || "Không thể tạo lịch khám. Vui lòng thử lại.",
      [
        { text: "OK" },
        { text: "Thử lại", onPress: handleContinue },
      ]
    );
  } finally {
    setIsSubmitting(false);
  }
};

  const renderSymptomItem = ({ item }: { item: Symptom }) => {
    const isSelected = selectedSymptoms.includes(item.id)

    return (
      <TouchableOpacity style={styles.symptomItem} onPress={() => handleSymptomToggle(item.id)} activeOpacity={0.7}>
        <Text style={[styles.symptomText, { fontFamily: fontFamily.medium }]}>{item.name}</Text>
        {isSelected && (
          <View style={styles.checkmark}>
            <Ionicons name="checkmark" size={16} color={colors.white} />
          </View>
        )}
      </TouchableOpacity>
    )
  }

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { fontFamily: fontFamily.regular }]}>Đang tải font...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <Header title="Chọn triệu chứng" showBack={true} onBackPress={() => navigation.goBack()} />

      <View style={styles.container}>
        {/* Doctor Information */}
        <DoctorHeader
          doctor={doctor}
          showFavorite={true}
          isFavorite={false}
          onFavoritePress={() => {}}
          showStatus={true}
          isOnline={true}
        />

        {/* Symptom Selection Section */}
        <ScrollView style={styles.symptomSection} showsVerticalScrollIndicator={false}>
          <Text style={[styles.sectionTitle, { fontFamily: fontFamily.bold }]}>Chọn triệu chứng</Text>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { fontFamily: fontFamily.regular }]}
              placeholder="Tìm triệu chứng"
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Category Label */}
          {selectedCategory ? (
            <Text style={[styles.categoryLabel, { fontFamily: fontFamily.medium }]}>{selectedCategory}</Text>
          ) : null}

          {/* Symptoms List */}
          <FlatList
            data={filteredSymptoms}
            renderItem={renderSymptomItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.symptomsList}
            scrollEnabled={false}
          />
        </ScrollView>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[globalStyles.button, (selectedSymptoms.length === 0 || isSubmitting) && styles.disabledButton]}
            onPress={handleContinue}
            disabled={selectedSymptoms.length === 0 || isSubmitting}
          >
            <Text style={[globalStyles.buttonText, { fontFamily: fontFamily.bold }]}>
              {isSubmitting ? "Đang xử lý..." : "Tiếp theo"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  symptomSection: {
    flex: 1,
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    color: colors.text,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.base50,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  categoryLabel: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
  },
  symptomsList: {
    paddingBottom: 20,
  },
  symptomItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  symptomText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#00B5B8",
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 34,
    paddingTop: 16,
    backgroundColor: colors.white,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 14,
    color: colors.gray600,
    marginTop: 12,
    textAlign: "center",
  },
})