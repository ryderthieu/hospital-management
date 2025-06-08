// EditAccountInfoScreen.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
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
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { fontFamily } from "../../../context/FontContext";
import Header from "../../../components/Header";
import API from "../../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { EditAccountInfoScreenNavigationProp } from "../../../navigation/types";

interface PatientData {
  patientId: number;
  userId: number;
  identityNumber: string;
  insuranceNumber: string;
  fullName: string;
  birthday: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
  province: string;
  district: string;
  ward: string;
  emergencyContactDtos: { phone: string; name: string; relationship: string }[];
}

// Define relationship options
const relationshipOptions = [
  { id: "1", label: "Bố", value: "Bố" },
  { id: "2", label: "Mẹ", value: "Mẹ" },
  { id: "3", label: "Anh ruột", value: "Anh ruột" },
  { id: "4", label: "Chị ruột", value: "Chị ruột" },
  { id: "5", label: "Em trai", value: "Em trai" },
  { id: "6", label: "Em gái", value: "Em gái" },
  { id: "7", label: "Vợ", value: "Vợ" },
  { id: "8", label: "Chồng", value: "Chồng" },
  { id: "9", label: "Con", value: "Con" },
  { id: "10", label: "Bạn", value: "Bạn" },
  { id: "11", label: "Họ hàng khác", value: "Họ hàng khác" },
];

// Input field component
const InputField = ({
  label,
  value,
  onChangeText,
  editable = true,
  icon,
  isPhone = false,
  isEmail = false,
  placeholder = "",
}: {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  editable?: boolean;
  icon?: string;
  isPhone?: boolean;
  isEmail?: boolean;
  placeholder?: string;
}) => {
  const inputRef = useRef<TextInput>(null);

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[styles.inputWrapper, isPhone || isEmail ? styles.inputWithIcon : null]}>
        {isPhone && (
          <View style={styles.phoneIconContainer}>
            <Ionicons name="call" size={16} color="#FFFFFF" />
          </View>
        )}
        {isEmail && (
          <View style={styles.emailIconContainer}>
            <Ionicons name="mail" size={16} color="#FFFFFF" />
          </View>
        )}
        <TextInput
          ref={inputRef}
          style={[styles.input, !editable && styles.readOnlyInput, (isPhone || isEmail) && styles.inputWithPadding]}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {icon && (
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name={icon as any} size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// Section component
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>{children}</View>
  </View>
);

const EditAccountInfoScreen: React.FC = () => {
  const navigation = useNavigation<EditAccountInfoScreenNavigationProp>();
  const [patientId, setPatientId] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    patientId: "",
    userId: "",
    identityNumber: "",
    insuranceNumber: "",
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    phone: "",
    email: "",
    province: "",
    district: "",
    ward: "",
    fullAddress: "",
    emergencyContactPhone: "",
    emergencyContactName: "",
    emergencyContactRelationship: "",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showRelationshipModal, setShowRelationshipModal] = useState(false);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const id = await AsyncStorage.getItem('patientId');
        if (!id) {
          Alert.alert('Lỗi', 'Không tìm thấy patientId. Vui lòng đăng nhập lại.');
          return;
        }
        setPatientId(id);

        const response = await API.get<PatientData>(`/patients/${id}`);
        const data = response.data;
        const [lastName, ...firstNameParts] = data.fullName.split(" ");
        setFormState({
          patientId: data.patientId.toString(),
          userId: data.userId.toString(),
          identityNumber: data.identityNumber || "",
          insuranceNumber: data.insuranceNumber || "",
          firstName: firstNameParts.join(" "),
          lastName: lastName,
          dob: data.birthday || "",
          gender: data.gender || "",
          phone: data.phone || "",
          email: data.email || "",
          province: data.province || "",
          district: data.district || "",
          ward: data.ward || "",
          fullAddress: data.address || "",
          emergencyContactPhone: data.emergencyContactDtos?.[0]?.phone || "",
          emergencyContactName: data.emergencyContactDtos?.[0]?.name || "",
          emergencyContactRelationship: data.emergencyContactDtos?.[0]?.relationship || "",
        });
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Không thể tải thông tin bệnh nhân. Vui lòng thử lại.';
        Alert.alert('Lỗi', errorMessage);
        console.error('Fetch patient error:', error.message, error.response?.data);
      }
    };

    fetchPatientData();
  }, []);

  // Update a single field in the form state
  const updateField = (field: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Format date from DD/MM/YYYY to YYYY-MM-DD for API
  const formatStringToDate = (dateString: string) => {
    if (!dateString) return "";
    const [day, month, year] = dateString.split("/").map(Number);
    return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
  };

  // Format date from Date object to DD/MM/YYYY
  const formatDateToString = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      updateField("dob", formatDateToString(selectedDate));
    }
  };

  const handleSave = async () => {
    if (!patientId) {
      Alert.alert('Lỗi', 'Không tìm thấy patientId. Vui lòng đăng nhập lại.');
      return;
    }

    // Construct the patient data for the API
    const updatedPatient = {
      userId: parseInt(formState.userId),
      patientId: parseInt(formState.patientId),
      identityNumber: formState.identityNumber,
      insuranceNumber: formState.insuranceNumber,
      fullName: `${formState.lastName} ${formState.firstName}`,
      birthday: formatStringToDate(formState.dob),
      gender: formState.gender,
      address: formState.fullAddress,
      phone: formState.phone,
      email: formState.email,
      province: formState.province,
      district: formState.district,
      ward: formState.ward,
      emergencyContactDtos: [
        {
          phone: formState.emergencyContactPhone,
          name: formState.emergencyContactName,
          relationship: formState.emergencyContactRelationship,
        },
      ],
    };

    try {
      await API.put(`/patients/${patientId}`, updatedPatient);
      Alert.alert('Thành công', 'Cập nhật thông tin thành công');
      navigation.goBack();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Cập nhật thông tin thất bại. Vui lòng thử lại.';
      Alert.alert('Lỗi', errorMessage);
      console.error('Update patient error:', error.message, error.response?.data);
    }
  };

  const handleSelectRelationship = (relationship: string) => {
    updateField("emergencyContactRelationship", relationship);
    setShowRelationshipModal(false);
  };

  // Relationship option item
  const RelationshipItem = ({
    item,
    onSelect,
  }: { item: (typeof relationshipOptions)[0]; onSelect: (value: string) => void }) => (
    <TouchableOpacity style={styles.relationshipItem} onPress={() => onSelect(item.value)}>
      <Text style={styles.relationshipItemText}>{item.label}</Text>
      {formState.emergencyContactRelationship === item.value && <Ionicons name="checkmark" size={20} color="#0BC5C5" />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Chỉnh sửa thông tin" showBack={true} onBackPress={() => navigation.goBack()} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView style={styles.scrollView}>
          {/* Personal Information Section */}
          <Section title="Thông tin cá nhân">
            <InputField label="Mã bệnh nhân" value={formState.patientId} editable={false} />
            <InputField
              label="CCCD/CMND"
              value={formState.identityNumber}
              onChangeText={(text) => updateField("identityNumber", text)}
            />
            <InputField
              label="Tên"
              value={formState.firstName}
              onChangeText={(text) => updateField("firstName", text)}
            />
            <InputField
              label="Họ"
              value={formState.lastName}
              onChangeText={(text) => updateField("lastName", text)}
            />
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Ngày sinh</Text>
              <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
                <Text style={styles.datePickerText}>{formState.dob || "Chọn ngày sinh"}</Text>
                <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Gender Selection */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Giới tính</Text>
              <View style={styles.genderContainer}>
                <TouchableOpacity style={styles.genderOption} onPress={() => updateField("gender", "Nữ")}>
                  <View style={[styles.radioButton, formState.gender === "Nữ" && styles.radioButtonSelected]}>
                    {formState.gender === "Nữ" && <View style={styles.radioButtonInner} />}
                  </View>
                  <Text style={styles.genderText}>Nữ</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.genderOption} onPress={() => updateField("gender", "Nam")}>
                  <View style={[styles.radioButton, formState.gender === "Nam" && styles.radioButtonSelected]}>
                    {formState.gender === "Nam" && <View style={styles.radioButtonInner} />}
                  </View>
                  <Text style={styles.genderText}>Nam</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Section>

          {/* Contact Information Section */}
          <Section title="Liên hệ">
            <InputField
              label="Nhập số điện thoại của bạn"
              value={formState.phone}
              onChangeText={(text) => updateField("phone", text)}
              isPhone={true}
            />
            <InputField
              label="Nhập email của bạn"
              value={formState.email}
              onChangeText={(text) => updateField("email", text)}
              isEmail={true}
            />
            <InputField
              label="Tỉnh/Thành phố"
              value={formState.province}
              onChangeText={(text) => updateField("province", text)}
            />
            <InputField
              label="Quận/Huyện"
              value={formState.district}
              onChangeText={(text) => updateField("district", text)}
            />
            <InputField
              label="Xã/Phường"
              value={formState.ward}
              onChangeText={(text) => updateField("ward", text)}
            />
            <InputField
              label="Địa chỉ"
              value={formState.fullAddress}
              onChangeText={(text) => updateField("fullAddress", text)}
            />
          </Section>

          {/* Emergency Contact Section */}
          <Section title="Liên hệ khẩn cấp">
            <InputField
              label="Nhập số điện thoại của người thân"
              value={formState.emergencyContactPhone}
              onChangeText={(text) => updateField("emergencyContactPhone", text)}
              isPhone={true}
            />
            <InputField
              label="Họ tên"
              value={formState.emergencyContactName}
              onChangeText={(text) => updateField("emergencyContactName", text)}
            />

            {/* Relationship Dropdown */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Mối quan hệ</Text>
              <TouchableOpacity style={styles.dropdownButton} onPress={() => setShowRelationshipModal(true)}>
                <Text
                  style={[
                    styles.dropdownText,
                    formState.emergencyContactRelationship ? styles.dropdownTextSelected : null,
                  ]}
                >
                  {formState.emergencyContactRelationship || "Chọn mối quan hệ"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </Section>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={formState.dob ? new Date(formState.dob.split("/").reverse().join("-")) : new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}

      {/* Relationship Selection Modal */}
      <Modal
        visible={showRelationshipModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRelationshipModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn mối quan hệ</Text>
              <TouchableOpacity onPress={() => setShowRelationshipModal(false)}>
                <Ionicons name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={relationshipOptions}
              renderItem={({ item }) => <RelationshipItem item={item} onSelect={handleSelectRelationship} />}
              keyExtractor={(item) => item.id}
              style={styles.relationshipList}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

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
  genderContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  genderOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  radioButtonSelected: {
    borderColor: "#0BC5C5",
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#0BC5C5",
  },
  genderText: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: "#111827",
  },
  inputWithIcon: {
    position: "relative",
  },
  phoneIconContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 40,
    backgroundColor: "#F44336",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  emailIconContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 40,
    backgroundColor: "#2196F3",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  inputWithPadding: {
    paddingLeft: 50,
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
  relationshipList: {
    maxHeight: 400,
  },
  relationshipItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  relationshipItemText: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: "#111827",
  },
});

export default EditAccountInfoScreen;