"use client"

import type React from "react"
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useState, useEffect } from "react"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import Slider from "@react-native-community/slider"
import { fontFamily } from "../../../context/FontContext"
import Header from "../../../components/Header"
import { mockHealthProfile, mockAllergyOptions, mockChronicConditionOptions } from "../Data"
import type { RootStackParamList } from "../type"

// Define the AllergyOption interface locally if it's not exported from the types file
interface AllergyOption {
  id: string
  name: string
  selected: boolean
}

// Define the ChronicConditionOption interface locally
interface ChronicConditionOption {
  id: string
  name: string
  selected: boolean
}

const EditHealthProfileScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, "EditHealthProfile">>()

  // State for form data
  const [height, setHeight] = useState(mockHealthProfile.height || 170)
  const [weight, setWeight] = useState(mockHealthProfile.weight || 72)

  // Allergies state
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>(mockHealthProfile.allergies || [])
  const [allergyOptions, setAllergyOptions] = useState<AllergyOption[]>(mockAllergyOptions || [])
  const [allergySearchQuery, setAllergySearchQuery] = useState("")

  // Chronic conditions state
  const [selectedChronicConditions, setSelectedChronicConditions] = useState<string[]>(
    mockHealthProfile.chronicConditions || [],
  )
  const [chronicConditionOptions, setChronicConditionOptions] = useState<ChronicConditionOption[]>(
    mockChronicConditionOptions || [],
  )
  const [chronicSearchQuery, setChronicSearchQuery] = useState("")

  // Show/hide sections
  const [showAllergiesOptions, setShowAllergiesOptions] = useState(true)
  const [showChronicOptions, setShowChronicOptions] = useState(true)

  useEffect(() => {
    // Ensure allergyOptions is initialized with mockAllergyOptions when available
    if (mockAllergyOptions && mockAllergyOptions.length > 0 && (!allergyOptions || allergyOptions.length === 0)) {
      setAllergyOptions(mockAllergyOptions)
    }

    // Ensure chronicConditionOptions is initialized
    if (
      mockChronicConditionOptions &&
      mockChronicConditionOptions.length > 0 &&
      (!chronicConditionOptions || chronicConditionOptions.length === 0)
    ) {
      setChronicConditionOptions(mockChronicConditionOptions)
    }
  }, [mockAllergyOptions, mockChronicConditionOptions])

  // Filter allergy options based on search query
  const filteredAllergyOptions = allergyOptions
    ? allergyOptions.filter((option) => option.name.toLowerCase().includes(allergySearchQuery.toLowerCase()))
    : []

  // Filter chronic condition options based on search query
  const filteredChronicOptions = chronicConditionOptions
    ? chronicConditionOptions.filter((option) => option.name.toLowerCase().includes(chronicSearchQuery.toLowerCase()))
    : []

  // Handle allergy selection
  const toggleAllergy = (allergyId: string, allergyName: string) => {
    const updatedOptions = allergyOptions.map((option) =>
      option.id === allergyId ? { ...option, selected: !option.selected } : option,
    )
    setAllergyOptions(updatedOptions)

    if (selectedAllergies.includes(allergyName)) {
      setSelectedAllergies(selectedAllergies.filter((allergy) => allergy !== allergyName))
    } else {
      setSelectedAllergies([...selectedAllergies, allergyName])
    }
  }

  // Remove allergy from selected list
  const removeAllergy = (allergyToRemove: string) => {
    setSelectedAllergies(selectedAllergies.filter((allergy) => allergy !== allergyToRemove))
    const updatedOptions = allergyOptions.map((option) =>
      option.name === allergyToRemove ? { ...option, selected: false } : option,
    )
    setAllergyOptions(updatedOptions)
  }

  // Handle chronic condition selection
  const toggleChronicCondition = (conditionId: string, conditionName: string) => {
    const updatedOptions = chronicConditionOptions.map((option) =>
      option.id === conditionId ? { ...option, selected: !option.selected } : option,
    )
    setChronicConditionOptions(updatedOptions)

    if (selectedChronicConditions.includes(conditionName)) {
      setSelectedChronicConditions(selectedChronicConditions.filter((condition) => condition !== conditionName))
    } else {
      setSelectedChronicConditions([...selectedChronicConditions, conditionName])
    }
  }

  // Remove chronic condition from selected list
  const removeChronicCondition = (conditionToRemove: string) => {
    setSelectedChronicConditions(selectedChronicConditions.filter((condition) => condition !== conditionToRemove))
    const updatedOptions = chronicConditionOptions.map((option) =>
      option.name === conditionToRemove ? { ...option, selected: false } : option,
    )
    setChronicConditionOptions(updatedOptions)
  }

  // Handle save changes
  const handleSaveChanges = () => {
    // In a real app, you would save the data to your backend or local storage
    Alert.alert("Thành công", "Hồ sơ sức khỏe đã được cập nhật!", [
      {
        text: "OK",
        onPress: () => navigation.goBack(),
      },
    ])
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="Hồ sơ sức khỏe" showBack={true} onBackPress={() => navigation.goBack()} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Height Section */}
        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <View style={styles.iconContainer}>
              <Ionicons name="resize-outline" size={24} color="#757575" />
            </View>
            <View style={styles.metricInfo}>
              <Text style={styles.metricLabel}>Chiều cao</Text>
              <Text style={styles.metricUnit}>(cms)</Text>
            </View>
          </View>

          <View style={styles.sliderContainer}>
            <View style={styles.sliderWrapper}>
              <Slider
                style={styles.slider}
                minimumValue={150}
                maximumValue={200}
                value={height}
                onValueChange={setHeight}
                minimumTrackTintColor="#00B5B8"
                maximumTrackTintColor="#E0E0E0"
                thumbStyle={styles.sliderThumb}
                trackStyle={styles.sliderTrack}
                step={1}
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>150</Text>
                <Text style={styles.sliderValue}>{Math.round(height)}</Text>
                <Text style={styles.sliderLabel}>200</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Weight Section */}
        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <View style={styles.iconContainer}>
              <Ionicons name="fitness-outline" size={24} color="#757575" />
            </View>
            <View style={styles.metricInfo}>
              <Text style={styles.metricLabel}>Cân nặng</Text>
              <Text style={styles.metricUnit}>(kgs)</Text>
            </View>
          </View>

          <View style={styles.sliderContainer}>
            <View style={styles.sliderWrapper}>
              <Slider
                style={styles.slider}
                minimumValue={40}
                maximumValue={120}
                value={weight}
                onValueChange={setWeight}
                minimumTrackTintColor="#00B5B8"
                maximumTrackTintColor="#E0E0E0"
                thumbStyle={styles.sliderThumb}
                trackStyle={styles.sliderTrack}
                step={1}
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>40</Text>
                <Text style={styles.sliderValue}>{Math.round(weight)}</Text>
                <Text style={styles.sliderLabel}>120</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Allergies Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dị ứng</Text>

          {/* Selected Allergies */}
          <View style={styles.selectedItemsContainer}>
            {selectedAllergies.map((allergy, index) => (
              <View key={index} style={styles.selectedItemTag}>
                <Text style={styles.selectedItemText}>{allergy}</Text>
                <TouchableOpacity onPress={() => removeAllergy(allergy)} style={styles.removeButton}>
                  <Ionicons name="close" size={16} color="#00838F" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              style={styles.expandButton}
              onPress={() => setShowAllergiesOptions(!showAllergiesOptions)}
            >
              <Ionicons name={showAllergiesOptions ? "chevron-up" : "chevron-down"} size={20} color="#00B5B8" />
            </TouchableOpacity>
          </View>

          {showAllergiesOptions && (
            <>
              {/* Search Input */}
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#757575" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Tìm kiếm dị ứng"
                  value={allergySearchQuery}
                  onChangeText={setAllergySearchQuery}
                  placeholderTextColor="#757575"
                />
              </View>

              {/* Allergy Options */}
              <View style={styles.optionsContainer}>
                {filteredAllergyOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={styles.optionItem}
                    onPress={() => toggleAllergy(option.id, option.name)}
                  >
                    <View style={[styles.checkbox, option.selected && styles.checkboxSelected]}>
                      {option.selected && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                    </View>
                    <Text style={[styles.optionText, option.selected && styles.optionTextSelected]}>{option.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </View>

        {/* Chronic Conditions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bệnh mãn tính</Text>

          {/* Selected Chronic Conditions */}
          <View style={styles.selectedItemsContainer}>
            {selectedChronicConditions.map((condition, index) => (
              <View key={index} style={[styles.selectedItemTag, { backgroundColor: "#FFF0E0" }]}>
                <Text style={[styles.selectedItemText, { color: "#F57C00" }]}>{condition}</Text>
                <TouchableOpacity onPress={() => removeChronicCondition(condition)} style={styles.removeButton}>
                  <Ionicons name="close" size={16} color="#F57C00" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.expandButton} onPress={() => setShowChronicOptions(!showChronicOptions)}>
              <Ionicons name={showChronicOptions ? "chevron-up" : "chevron-down"} size={20} color="#00B5B8" />
            </TouchableOpacity>
          </View>

          {showChronicOptions && (
            <>
              {/* Search Input */}
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#757575" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Tìm kiếm bệnh mãn tính"
                  value={chronicSearchQuery}
                  onChangeText={setChronicSearchQuery}
                  placeholderTextColor="#757575"
                />
              </View>

              {/* Chronic Condition Options */}
              <View style={styles.optionsContainer}>
                {filteredChronicOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={styles.optionItem}
                    onPress={() => toggleChronicCondition(option.id, option.name)}
                  >
                    <View style={[styles.checkbox, option.selected && styles.checkboxSelected]}>
                      {option.selected && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                    </View>
                    <Text style={[styles.optionText, option.selected && styles.optionTextSelected]}>{option.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Save Button */}
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
          <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
        </TouchableOpacity>
      </View>
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
  metricCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    marginTop: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  metricHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  metricInfo: {
    flex: 1,
  },
  metricLabel: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: "#212121",
  },
  metricUnit: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: "#757575",
    marginTop: 2,
  },
  sliderContainer: {
    paddingHorizontal: 10,
  },
  sliderWrapper: {
    position: "relative",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderThumb: {
    backgroundColor: "#00B5B8",
    width: 20,
    height: 20,
  },
  sliderTrack: {
    height: 4,
    borderRadius: 2,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  sliderLabel: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: "#757575",
  },
  sliderValue: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: "#212121",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: "#212121",
    marginBottom: 15,
  },
  selectedItemsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#00B5B8",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedItemTag: {
    backgroundColor: "#E0F7FA",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  selectedItemText: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: "#00838F",
    marginRight: 5,
  },
  removeButton: {
    padding: 2,
  },
  expandButton: {
    marginLeft: "auto",
    padding: 5,
  },
  searchContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: "#212121",
  },
  optionsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 15,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: "#00B5B8",
    borderColor: "#00B5B8",
  },
  optionText: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: "#212121",
  },
  optionTextSelected: {
    fontFamily: fontFamily.medium,
    color: "#00B5B8",
  },
  bottomSpace: {
    height: 100,
  },
  saveButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F2F2F2",
  },
  saveButton: {
    backgroundColor: "#00B5B8",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
  },
  saveButtonText: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: "#FFFFFF",
  },
})

export default EditHealthProfileScreen
