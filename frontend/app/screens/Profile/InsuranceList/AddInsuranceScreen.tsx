"use client"

import type React from "react"
import { useState, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Switch,
  Alert,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import DateTimePicker from "@react-native-community/datetimepicker"
import { fontFamily } from "../../../context/FontContext"
import Header from "../../../components/Header"
import { mockInsurances } from "../Data"
import type { InsuranceListScreenNavigationProp } from "../../../navigation/types"
import { useAlert } from '../../../context/AlertContext'

// Insurance types
const insuranceTypes = [
  { id: "1", label: "Bảo hiểm y tế", value: "BHYT" },
  { id: "2", label: "Bảo hiểm tai nạn", value: "BHTN" },
  { id: "3", label: "Bảo hiểm khác", value: "OTHER" },
]

// Input field component (defined outside the main component to prevent re-renders)
const InputField = ({
  label,
  value,
  onChangeText,
  editable = true,
  icon,
  placeholder = "",
  multiline = false,
  required = false,
}: {
  label: string
  value: string
  onChangeText?: (text: string) => void
  editable?: boolean
  icon?: string
  placeholder?: string
  multiline?: boolean
  required?: boolean
}) => {
  const inputRef = useRef<TextInput>(null)

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>
        {label} {required && <Text style={styles.requiredStar}>*</Text>}
      </Text>
      <View style={styles.inputWrapper}>
        <TextInput
          ref={inputRef}
          style={[styles.input, !editable && styles.readOnlyInput, multiline && styles.multilineInput]}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          autoCorrect={false}
          multiline={multiline}
        />
        {icon && (
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name={icon as any} size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

// Section component (defined outside the main component to prevent re-renders)
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>{children}</View>
  </View>
)

const AddInsuranceScreen: React.FC = () => {
  const navigation = useNavigation<InsuranceListScreenNavigationProp>()
  const { showAlert } = useAlert()

  // Initialize empty form state
  const [formState, setFormState] = useState({
    name: "",
    type: "",
    provider: "",
    policyNumber: "",
    holderName: "",
    startDate: "",
    expiryDate: "",
    coverageType: "",
    isActive: true,
    class: "",
    coverageAmount: "",
    paymentFrequency: "",
    paymentAmount: "",
    lastPaymentDate: "",
    nextPaymentDate: "",
    benefits: [] as string[],
    newBenefit: "", // For adding new benefits
  })

  const [showStartDatePicker, setShowStartDatePicker] = useState(false)
  const [showExpiryDatePicker, setShowExpiryDatePicker] = useState(false)
  const [showLastPaymentDatePicker, setShowLastPaymentDatePicker] = useState(false)
  const [showNextPaymentDatePicker, setShowNextPaymentDatePicker] = useState(false)
  const [showTypeModal, setShowTypeModal] = useState(false)

  // Update a single field in the form state
  const updateField = (field: string, value: any) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Format date from DD/MM/YYYY to Date object
  const formatStringToDate = (dateString: string) => {
    if (!dateString) return new Date()
    const [day, month, year] = dateString.split("/").map(Number)
    return new Date(year, month - 1, day)
  }

  // Format date from Date object to DD/MM/YYYY
  const formatDateToString = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(Platform.OS === "ios")
    if (selectedDate) {
      updateField("startDate", formatDateToString(selectedDate))
    }
  }

  const handleExpiryDateChange = (event: any, selectedDate?: Date) => {
    setShowExpiryDatePicker(Platform.OS === "ios")
    if (selectedDate) {
      updateField("expiryDate", formatDateToString(selectedDate))
    }
  }

  const handleLastPaymentDateChange = (event: any, selectedDate?: Date) => {
    setShowLastPaymentDatePicker(Platform.OS === "ios")
    if (selectedDate) {
      updateField("lastPaymentDate", formatDateToString(selectedDate))
    }
  }

  const handleNextPaymentDateChange = (event: any, selectedDate?: Date) => {
    setShowNextPaymentDatePicker(Platform.OS === "ios")
    if (selectedDate) {
      updateField("nextPaymentDate", formatDateToString(selectedDate))
    }
  }

  const handleAddBenefit = () => {
    if (formState.newBenefit.trim()) {
      updateField("benefits", [...formState.benefits, formState.newBenefit.trim()])
      updateField("newBenefit", "")
    }
  }

  const handleRemoveBenefit = (index: number) => {
    const updatedBenefits = [...formState.benefits]
    updatedBenefits.splice(index, 1)
    updateField("benefits", updatedBenefits)
  }

  const handleSelectType = (type: string) => {
    updateField("type", type)
    setShowTypeModal(false)
  }

  const validateForm = () => {
    // Required fields
    const requiredFields = [
      { field: "name", label: "Tên bảo hiểm" },
      { field: "type", label: "Loại bảo hiểm" },
      { field: "provider", label: "Nhà cung cấp" },
      { field: "policyNumber", label: "Số hợp đồng/Mã thẻ" },
      { field: "holderName", label: "Tên chủ hợp đồng" },
      { field: "expiryDate", label: "Ngày hết hạn" },
    ]

    for (const { field, label } of requiredFields) {
      if (!formState[field as keyof typeof formState]) {
        showAlert({ title: 'Thông tin thiếu', message: `Vui lòng nhập ${label}` })
        return false
      }
    }

    return true
  }

  const handleSave = () => {
    if (!validateForm()) return

    // Create a new insurance object
    const newInsurance = {
      id: (mockInsurances.length + 1).toString(), // Generate a new ID
      name: formState.name,
      type: formState.type as "BHYT" | "BHTN" | "OTHER",
      provider: formState.provider,
      policyNumber: formState.policyNumber,
      holderName: formState.holderName,
      startDate: formState.startDate,
      expiryDate: formState.expiryDate,
      coverageType: formState.coverageType || "Cơ bản",
      isActive: formState.isActive,
      class: formState.class,
      coverageAmount: formState.coverageAmount,
      paymentFrequency: formState.paymentFrequency,
      paymentAmount: formState.paymentAmount,
      lastPaymentDate: formState.lastPaymentDate,
      nextPaymentDate: formState.nextPaymentDate,
      benefits: formState.benefits,
    }

    // In a real app, you would add this to your backend
    console.log("Adding new insurance:", newInsurance)

    // Show success message
    showAlert({ title: 'Thành công', message: 'Đã thêm bảo hiểm mới', buttons: [
      { text: 'OK', onPress: () => {
        // Navigate back to the insurance list
        navigation.goBack()
      } }
    ] })
  }

  // Insurance type option item
  const TypeItem = ({ item, onSelect }: { item: (typeof insuranceTypes)[0]; onSelect: (value: string) => void }) => (
    <TouchableOpacity style={styles.typeItem} onPress={() => onSelect(item.value)}>
      <Text style={styles.typeItemText}>{item.label}</Text>
      {formState.type === item.value && <Ionicons name="checkmark" size={20} color="#0BC5C5" />}
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Thêm bảo hiểm mới" showBack={true} onBackPress={() => navigation.goBack()} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView style={styles.scrollView}>
          {/* Basic Information Section */}
          <Section title="Thông tin cơ bản">
            <InputField
              label="Tên bảo hiểm"
              value={formState.name}
              onChangeText={(text) => updateField("name", text)}
              placeholder="Nhập tên bảo hiểm"
              required
            />

            {/* Insurance Type Dropdown */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Loại bảo hiểm <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TouchableOpacity style={styles.dropdownButton} onPress={() => setShowTypeModal(true)}>
                <Text style={[styles.dropdownText, formState.type ? styles.dropdownTextSelected : null]}>
                  {insuranceTypes.find((t) => t.value === formState.type)?.label || "Chọn loại bảo hiểm"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <InputField
              label="Nhà cung cấp"
              value={formState.provider}
              onChangeText={(text) => updateField("provider", text)}
              placeholder="Nhập tên nhà cung cấp"
              required
            />

            <InputField
              label="Số hợp đồng/Mã thẻ"
              value={formState.policyNumber}
              onChangeText={(text) => updateField("policyNumber", text)}
              placeholder="Nhập số hợp đồng hoặc mã thẻ"
              required
            />

            <InputField
              label="Tên chủ hợp đồng"
              value={formState.holderName}
              onChangeText={(text) => updateField("holderName", text)}
              placeholder="Nhập tên chủ hợp đồng"
              required
            />

            {formState.type === "BHYT" && (
              <InputField
                label="Hạng thẻ"
                value={formState.class}
                onChangeText={(text) => updateField("class", text)}
                placeholder="Nhập hạng thẻ (ví dụ: 1, 2, 3)"
              />
            )}

            <InputField
              label="Loại bảo hiểm"
              value={formState.coverageType}
              onChangeText={(text) => updateField("coverageType", text)}
              placeholder="Nhập loại bảo hiểm (ví dụ: Toàn diện, Cơ bản)"
            />

            {/* Date Pickers */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Ngày hiệu lực</Text>
              <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowStartDatePicker(true)}>
                <Text style={[styles.datePickerText, !formState.startDate && styles.placeholderText]}>
                  {formState.startDate || "Chọn ngày hiệu lực"}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Ngày hết hạn <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowExpiryDatePicker(true)}>
                <Text style={[styles.datePickerText, !formState.expiryDate && styles.placeholderText]}>
                  {formState.expiryDate || "Chọn ngày hết hạn"}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Active Status Toggle */}
            <View style={styles.toggleContainer}>
              <Text style={styles.toggleLabel}>Còn hiệu lực</Text>
              <Switch
                value={formState.isActive}
                onValueChange={(value) => updateField("isActive", value)}
                trackColor={{ false: "#D1D5DB", true: "#0BC5C5" }}
                thumbColor="#FFFFFF"
              />
            </View>
          </Section>

          {/* Additional Information Section (for non-BHYT) */}
          {formState.type !== "BHYT" && formState.type !== "" && (
            <Section title="Thông tin bổ sung">
              <InputField
                label="Số tiền bảo hiểm"
                value={formState.coverageAmount}
                onChangeText={(text) => updateField("coverageAmount", text)}
                placeholder="Nhập số tiền bảo hiểm (ví dụ: 500.000.000 VND)"
              />

              <InputField
                label="Tần suất đóng phí"
                value={formState.paymentFrequency}
                onChangeText={(text) => updateField("paymentFrequency", text)}
                placeholder="Nhập tần suất đóng phí (ví dụ: Hàng quý, Hàng năm)"
              />

              <InputField
                label="Số tiền đóng mỗi kỳ"
                value={formState.paymentAmount}
                onChangeText={(text) => updateField("paymentAmount", text)}
                placeholder="Nhập số tiền đóng mỗi kỳ (ví dụ: 3.000.000 VND)"
              />

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Ngày đóng phí gần nhất</Text>
                <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowLastPaymentDatePicker(true)}>
                  <Text style={[styles.datePickerText, !formState.lastPaymentDate && styles.placeholderText]}>
                    {formState.lastPaymentDate || "Chọn ngày"}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Ngày đóng phí tiếp theo</Text>
                <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowNextPaymentDatePicker(true)}>
                  <Text style={[styles.datePickerText, !formState.nextPaymentDate && styles.placeholderText]}>
                    {formState.nextPaymentDate || "Chọn ngày"}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            </Section>
          )}

          {/* Benefits Section */}
          <Section title="Quyền lợi bảo hiểm">
            {formState.benefits.length > 0 ? (
              <View style={styles.benefitsList}>
                {formState.benefits.map((benefit, index) => (
                  <View key={index} style={styles.benefitItem}>
                    <Ionicons name="checkmark-circle" size={20} color="#0BC5C5" style={styles.benefitIcon} />
                    <Text style={styles.benefitText}>{benefit}</Text>
                    <TouchableOpacity onPress={() => handleRemoveBenefit(index)}>
                      <Ionicons name="close-circle" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noBenefitsText}>Chưa có quyền lợi nào được thêm</Text>
            )}

            <View style={styles.addBenefitContainer}>
              <TextInput
                style={styles.addBenefitInput}
                value={formState.newBenefit}
                onChangeText={(text) => updateField("newBenefit", text)}
                placeholder="Thêm quyền lợi mới"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity style={styles.addBenefitButton} onPress={handleAddBenefit}>
                <Ionicons name="add" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </Section>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Thêm bảo hiểm</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Date Pickers */}
      {showStartDatePicker && (
        <DateTimePicker
          value={formatStringToDate(formState.startDate || "")}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
        />
      )}

      {showExpiryDatePicker && (
        <DateTimePicker
          value={formatStringToDate(formState.expiryDate || "")}
          mode="date"
          display="default"
          onChange={handleExpiryDateChange}
          minimumDate={new Date()}
        />
      )}

      {showLastPaymentDatePicker && (
        <DateTimePicker
          value={formatStringToDate(formState.lastPaymentDate || "")}
          mode="date"
          display="default"
          onChange={handleLastPaymentDateChange}
          maximumDate={new Date()}
        />
      )}

      {showNextPaymentDatePicker && (
        <DateTimePicker
          value={formatStringToDate(formState.nextPaymentDate || "")}
          mode="date"
          display="default"
          onChange={handleNextPaymentDateChange}
          minimumDate={new Date()}
        />
      )}

      {/* Insurance Type Selection Modal */}
      <Modal
        visible={showTypeModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTypeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn loại bảo hiểm</Text>
              <TouchableOpacity onPress={() => setShowTypeModal(false)}>
                <Ionicons name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={insuranceTypes}
              renderItem={({ item }) => <TypeItem item={item} onSelect={handleSelectType} />}
              keyExtractor={(item) => item.id}
              style={styles.typeList}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: fontFamily.medium,
    fontSize: 18,
    color: "#6B7280",
    marginBottom: 16,
  },
  sectionContent: {
    marginBottom: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 8,
  },
  requiredStar: {
    color: "#EF4444",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: "#111827",
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  readOnlyInput: {
    backgroundColor: "#F3F4F6",
    color: "#6B7280",
  },
  iconButton: {
    position: "absolute",
    right: 12,
  },
  datePickerButton: {
    height: 48,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  datePickerText: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: "#111827",
  },
  placeholderText: {
    color: "#9CA3AF",
    fontFamily: fontFamily.regular,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  toggleLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: "#111827",
  },
  dropdownButton: {
    height: 48,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownText: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: "#9CA3AF",
  },
  dropdownTextSelected: {
    color: "#111827",
    fontFamily: fontFamily.medium,
  },
  benefitsList: {
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 8,
  },
  benefitIcon: {
    marginRight: 8,
  },
  benefitText: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: "#4B5563",
    flex: 1,
  },
  noBenefitsText: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: "#9CA3AF",
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 16,
  },
  addBenefitContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  addBenefitInput: {
    flex: 1,
    height: 48,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: "#111827",
    marginRight: 8,
  },
  addBenefitButton: {
    width: 48,
    height: 48,
    backgroundColor: "#0BC5C5",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#0BC5C5",
    borderRadius: 8,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 24,
  },
  saveButtonText: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: "#FFFFFF",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: "#111827",
  },
  typeList: {
    maxHeight: 300,
  },
  typeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  typeItemText: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: "#111827",
  },
})

export default AddInsuranceScreen
