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

type SymptomSelectionScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "SymptomSelection">
  route: RouteProp<RootStackParamList, "SymptomSelection">
}

interface Symptom {
  id: string
  name: string
  category?: string
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
  const { doctor, selectedDate, selectedTime, hasInsurance } = route.params

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(["1"]) // Default: "Đau lưng" selected
  const [selectedCategory, setSelectedCategory] = useState<string>("Viêm ruột thừa")

  // Filter symptoms based on search query
  const filteredSymptoms = useMemo(() => {
    if (!searchQuery.trim()) return symptomsData

    return symptomsData.filter((symptom) => symptom.name.toLowerCase().includes(searchQuery.toLowerCase().trim()))
  }, [searchQuery])

  const handleSymptomToggle = (symptomId: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomId) ? prev.filter((id) => id !== symptomId) : [...prev, symptomId],
    )
  }

  const handleContinue = () => {
    if (selectedSymptoms.length === 0) {
      Alert.alert("Thông báo", "Vui lòng chọn ít nhất một triệu chứng.", [{ text: "OK" }])
      return
    }

    const selectedSymptomNames = symptomsData
      .filter((symptom) => selectedSymptoms.includes(symptom.id))
      .map((symptom) => symptom.name)

    // Navigate to booking confirmation screen
    navigation.navigate("BookingConfirmation", {
      doctor,
      selectedDate,
      selectedTime,
      hasInsurance,
      selectedSymptoms: selectedSymptomNames,
    })
  }

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
    return null
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <Header title="Đặt lịch hẹn" showBack={true} onBackPress={() => navigation.goBack()} />

      <View style={styles.container}>
        {/* Doctor Information */}
        <DoctorHeader
          doctor={doctor}
          showFavorite={true}
          isFavorite={false} // hoặc có thể manage state nếu cần
          onFavoritePress={() => {}} // hoặc implement nếu cần
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
          <Text style={[styles.categoryLabel, { fontFamily: fontFamily.medium }]}>{selectedCategory}</Text>

          {/* Symptoms List */}
          <FlatList
            data={filteredSymptoms}
            renderItem={renderSymptomItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.symptomsList}
            scrollEnabled={false} // Disable FlatList scroll, let parent ScrollView handle it
          />
        </ScrollView>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[globalStyles.button, selectedSymptoms.length === 0 && styles.disabledButton]}
            onPress={handleContinue}
            disabled={selectedSymptoms.length === 0}
          >
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
  },
  symptomSection: {
    flex: 1,
    marginTop: 24,
    paddingHorizontal: 16, // Add this line
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
})
