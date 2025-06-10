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
import { useAuth } from "../../../context/AuthContext";
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
  emergencyContactDtos: {
    contactId?: number;
    phone: string;
    name: string;
    relationship: string;
  }[];
}

interface UserData {
  userId: number;
  phone: string;
  email: string;
}

interface EmergencyContactResponse {
  contactId?: number;
  contactPhone: string;
  contactName: string;
  relationship: string;
}

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
  value: string | null | undefined;
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
      <View
        style={[
          styles.inputWrapper,
          isPhone || isEmail ? styles.inputWithIcon : null,
        ]}
      >
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
          style={[
            styles.input,
            !editable && styles.readOnlyInput,
            (isPhone || isEmail) && styles.inputWithPadding,
          ]}
          value={value || ""}
          onChangeText={(text) => onChangeText && onChangeText(text)}
          editable={editable}
          placeholder={placeholder || `Nhập ${label.toLowerCase()}`}
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

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>{children}</View>
  </View>
);

const InfoItem = ({
  label,
  value,
}: {
  label: string;
  value: string | undefined | null;
}) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value || "Chưa cập nhật"}</Text>
  </View>
);

const EditAccountInfoScreen: React.FC = () => {
  const navigation = useNavigation<EditAccountInfoScreenNavigationProp>();
  const { patient, user, setPatient } = useAuth();
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
  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);
  const [emergencyContacts, setEmergencyContacts] = useState<
    PatientData["emergencyContactDtos"]
  >(patient?.emergencyContactDtos || []);

  useEffect(() => {
    if (showSuccessAlert) {
      const timer = setTimeout(() => {
        setShowSuccessAlert(false);
        console.log("Success alert auto-dismissed");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessAlert]);

  useEffect(() => {
    if (patient && user) {
      const [lastName, ...firstNameParts] = patient.fullName
        .split(" ")
        .filter(Boolean); // Loại bỏ phần tử rỗng
      const firstName = firstNameParts.join(" ");
      // Chuyển đổi birthday sang định dạng dd/MM/yyyy
      const dob = patient.birthday
        ? new Date(patient.birthday).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "";
      // Chuyển đổi gender sang giá trị giao diện
      const gender =
        patient.gender === "FEMALE"
          ? "Nữ"
          : patient.gender === "MALE"
          ? "Nam"
          : "";

      setFormState({
        patientId: patient.patientId.toString(),
        userId: patient.userId.toString(),
        identityNumber: patient.identityNumber || "",
        insuranceNumber: patient.insuranceNumber || "",
        firstName: firstName || "",
        lastName: lastName || "",
        dob: dob || "",
        gender: gender || "",
        phone: user.phone || "",
        email: patient.email || "",
        province: patient.province || "",
        district: patient.district || "",
        ward: patient.ward || "",
        fullAddress: patient.address || "",
        emergencyContactPhone: patient.emergencyContactDtos?.[0]?.phone || "",
        emergencyContactName: patient.emergencyContactDtos?.[0]?.name || "",
        emergencyContactRelationship:
          patient.emergencyContactDtos?.[0]?.relationship || "",
      });
      setEmergencyContacts(patient.emergencyContactDtos || []);
    } else {
      Alert.alert(
        "Lỗi",
        "Không tìm thấy thông tin bệnh nhân hoặc người dùng. Vui lòng đăng nhập lại."
      );
    }
  }, [patient, user]);

  const updateField = (field: string, value: string) => {
    console.log(`Updating ${field} to:`, value);
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatStringToDate = (dateString: string) => {
    if (!dateString) return "";
    const [day, month, year] = dateString.split("/").map(Number);
    return `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
  };

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
    console.log("handleSave called", { patient, user });
    if (!patient || !user) {
      console.log("No patient or user data");
      Alert.alert(
        "Lỗi",
        "Không tìm thấy thông tin bệnh nhân hoặc người dùng. Vui lòng đăng nhập lại."
      );
      return;
    }

    // Ghép fullName từ lastName và firstName
    const fullName = `${formState.lastName || ""} ${
      formState.firstName || ""
    }`.trim();
    if (!fullName || !formState.dob || !formState.gender) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin cá nhân.");
      return;
    }

    const updatedPatient = {
      userId: parseInt(formState.userId),
      patientId: parseInt(formState.patientId),
      identityNumber: formState.identityNumber,
      insuranceNumber: formState.insuranceNumber,
      fullName: fullName,
      birthday: formatStringToDate(formState.dob),
      gender:
        formState.gender === "Nữ"
          ? "FEMALE"
          : formState.gender === "Nam"
          ? "MALE"
          : formState.gender,
      address: formState.fullAddress,
      email: formState.email,
      province: formState.province,
      district: formState.district,
      ward: formState.ward,
      emergencyContactDtos: emergencyContacts.map((contact) => ({
        ...contact,
        relationship: contact.relationship,
      })),
    };

    try {
      console.log("Updating patient with data:", updatedPatient);
      const response = await API.put(
        `/patients/${patient.patientId}`,
        updatedPatient
      );
      console.log("API response:", response.data);
      await AsyncStorage.setItem("patient", JSON.stringify(updatedPatient));
      setPatient(updatedPatient);
      setShowSuccessAlert(true);
      navigation.goBack();
    } catch (error: any) {
      console.error(
        "Update patient error:",
        error.message,
        error.response?.data
      );
      const errorMessage =
        error.message || "Cập nhật thông tin thất bại. Vui lòng thử lại.";
      Alert.alert("Lỗi", errorMessage);
    }
  };

  const handleAddEmergencyContact = async () => {
    if (!patient?.patientId) {
      Alert.alert("Lỗi", "Không tìm thấy thông tin bệnh nhân.");
      return;
    }

    console.log("Form state before adding:", formState);

    const {
      emergencyContactPhone,
      emergencyContactName,
      emergencyContactRelationship,
    } = formState;

    if (!emergencyContactPhone || emergencyContactPhone.trim() === "") {
      console.log("Phone is invalid:", emergencyContactPhone);
      Alert.alert("Lỗi", "Vui lòng điền số điện thoại.");
      return;
    }
    if (!emergencyContactName || emergencyContactName.trim() === "") {
      console.log("Name is invalid:", emergencyContactName);
      Alert.alert("Lỗi", "Vui lòng điền họ tên.");
      return;
    }
    if (!emergencyContactRelationship) {
      console.log("Relationship is invalid:", emergencyContactRelationship);
      Alert.alert("Lỗi", "Vui lòng chọn mối quan hệ.");
      return;
    }

    const newContact = {
      contactPhone: emergencyContactPhone,
      contactName: emergencyContactName,
      relationship: emergencyContactRelationship,
    };

    try {
      console.log("Sending new contact:", newContact);
      const response = await API.post(
        `/patients/${patient.patientId}/contacts`,
        newContact
      );
      console.log("API response:", response.data);

      const updatedContact: PatientData["emergencyContactDtos"][number] = {
        contactId: response.data.contactId,
        phone: response.data.contactPhone || emergencyContactPhone,
        name: response.data.contactName || emergencyContactName,
        relationship:
          response.data.relationship || emergencyContactRelationship,
      };
      setEmergencyContacts((prev) => [...prev, updatedContact]);
      Alert.alert("Thành công", "Thêm liên hệ khẩn cấp thành công");
      updateField("emergencyContactPhone", "");
      updateField("emergencyContactName", "");
      updateField("emergencyContactRelationship", "");
    } catch (error: any) {
      console.error(
        "Error adding emergency contact:",
        error.message,
        error.response?.data
      );
      const errorMessage =
        error.response?.data?.message || "Thêm liên hệ khẩn cấp thất bại";
      Alert.alert("Lỗi", errorMessage);
    }
  };

  const handleDeleteEmergencyContact = async (contactId: number) => {
    try {
      await API.delete(`/patients/${patient?.patientId}/contacts/${contactId}`);
      setEmergencyContacts(
        emergencyContacts.filter((contact) => contact.contactId !== contactId)
      );
      Alert.alert("Thành công", "Xóa liên hệ khẩn cấp thành công");
    } catch (error: any) {
      console.error(
        "Error deleting emergency contact:",
        error.message,
        error.response?.data
      );
      Alert.alert(
        "Lỗi",
        error.response?.data?.message || "Xóa liên hệ khẩn cấp thất bại"
      );
    }
  };

  const handleUpdateEmergencyContact = async (contactId: number) => {
    const updatedContact = {
      contactPhone: formState.emergencyContactPhone,
      contactName: formState.emergencyContactName,
      relationship: formState.emergencyContactRelationship,
    };

    try {
      const response = await API.put(
        `/patients/${patient?.patientId}/contacts/${contactId}`,
        updatedContact
      );
      setEmergencyContacts(
        emergencyContacts.map((contact) =>
          contact.contactId === contactId ? response.data : contact
        )
      );
      Alert.alert("Thành công", "Cập nhật liên hệ khẩn cấp thành công");
      updateField("emergencyContactPhone", "");
      updateField("emergencyContactName", "");
      updateField("emergencyContactRelationship", "");
    } catch (error: any) {
      console.error(
        "Error updating emergency contact:",
        error.message,
        error.response?.data
      );
      Alert.alert(
        "Lỗi",
        error.response?.data?.message || "Cập nhật liên hệ khẩn cấp thất bại"
      );
    }
  };

  const handleSelectRelationship = (relationship: string) => {
    updateField("emergencyContactRelationship", relationship);
    setShowRelationshipModal(false);
  };

  const RelationshipItem = ({
    item,
    onSelect,
  }: {
    item: { id: string; label: string; value: string };
    onSelect: (value: string) => void;
  }) => (
    <TouchableOpacity
      style={styles.relationshipItem}
      onPress={() => onSelect(item.value)}
    >
      <Text style={styles.relationshipItemText}>{item.label}</Text>
      {formState.emergencyContactRelationship === item.value && (
        <Ionicons name="checkmark" size={20} color="#0BC5C5" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Chỉnh sửa thông tin"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView style={styles.scrollView}>
          {/* Personal Information Section */}
          <Section title="Thông tin cá nhân">
            <InputField
              label="Mã bệnh nhân"
              value={formState.patientId}
              editable={false}
            />
            <InputField
              label="CCCD/CMND"
              value={formState.identityNumber}
              onChangeText={(text) => updateField("identityNumber", text)}
              placeholder="Nhập số CCCD/CMND"
            />
            <InputField
              label="Tên"
              value={formState.firstName}
              onChangeText={(text) => updateField("firstName", text)}
              placeholder="Nhập tên"
            />
            <InputField
              label="Họ"
              value={formState.lastName}
              onChangeText={(text) => updateField("lastName", text)}
              placeholder="Nhập họ"
            />
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Ngày sinh</Text>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text
                  style={[
                    styles.datePickerText,
                    !formState.dob && styles.placeholderText,
                  ]}
                >
                  {formState.dob || "Chọn ngày sinh"}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Gender Selection */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Giới tính</Text>
              <View style={styles.genderContainer}>
                <TouchableOpacity
                  style={styles.genderOption}
                  onPress={() => updateField("gender", "Nữ")}
                >
                  <View
                    style={[
                      styles.radioButton,
                      formState.gender === "Nữ" && styles.radioButtonSelected,
                    ]}
                  >
                    {formState.gender === "Nữ" && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                  <Text style={styles.genderText}>Nữ</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.genderOption}
                  onPress={() => updateField("gender", "Nam")}
                >
                  <View
                    style={[
                      styles.radioButton,
                      formState.gender === "Nam" && styles.radioButtonSelected,
                    ]}
                  >
                    {formState.gender === "Nam" && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                  <Text style={styles.genderText}>Nam</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Section>

          {/* Contact Information Section */}
          <Section title="Liên hệ">
            <InputField
              label="Số điện thoại"
              value={formState.phone || "Chưa cập nhật"}
              editable={false}
              isPhone={true}
            />
            <InputField
              label="Email"
              value={formState.email}
              onChangeText={(text) => updateField("email", text)}
              isEmail={true}
              placeholder="Nhập email"
            />
            <InputField
              label="Địa chỉ"
              value={formState.fullAddress}
              onChangeText={(text) => updateField("fullAddress", text)}
              placeholder="Nhập địa chỉ"
            />
          </Section>

          {/* Emergency Contact Section */}
          <Section title="Liên hệ khẩn cấp">
            {emergencyContacts.map((contact, index) => (
              <View key={contact.contactId || index} style={styles.contactItem}>
                <View style={styles.infoRow}>
                  <InfoItem label="Số điện thoại" value={contact.phone} />
                  <TouchableOpacity
                    onPress={() =>
                      handleDeleteEmergencyContact(contact.contactId!)
                    }
                  >
                    <Ionicons name="trash" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
                <View style={styles.infoRow}>
                  <InfoItem label="Họ tên" value={contact.name} />
                </View>
                <View style={styles.infoRow}>
                  <InfoItem label="Mối quan hệ" value={contact.relationship} />
                </View>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => {
                    updateField("emergencyContactPhone", contact.phone || "");
                    updateField("emergencyContactName", contact.name || "");
                    updateField(
                      "emergencyContactRelationship",
                      contact.relationship || ""
                    );
                  }}
                >
                  <Text style={styles.editButtonText}>Sửa</Text>
                </TouchableOpacity>
              </View>
            ))}
            <InputField
              label="Số điện thoại"
              value={formState.emergencyContactPhone}
              onChangeText={(text) =>
                updateField("emergencyContactPhone", text)
              }
              isPhone={true}
              placeholder="Nhập số điện thoại người thân"
            />
            <InputField
              label="Họ tên"
              value={formState.emergencyContactName}
              onChangeText={(text) => updateField("emergencyContactName", text)}
              placeholder="Nhập họ tên người thân"
            />
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Mối quan hệ</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowRelationshipModal(true)}
              >
                <Text
                  style={[
                    styles.dropdownText,
                    formState.emergencyContactRelationship
                      ? styles.dropdownTextSelected
                      : styles.placeholderText,
                  ]}
                >
                  {formState.emergencyContactRelationship || "Chọn mối quan hệ"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddEmergencyContact}
            >
              <Text style={styles.addButtonText}>Thêm liên hệ khẩn cấp</Text>
            </TouchableOpacity>
          </Section>

          {/* Save Button */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => {
              console.log("Save button pressed");
              handleSave();
            }}
          >
            <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={
            formState.dob
              ? new Date(formState.dob.split("/").reverse().join("-"))
              : new Date()
          }
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}

      {/* Success Alert */}
      {showSuccessAlert &&
        Alert.alert("Thành công", "Cập nhật thông tin thành công", [
          {
            text: "OK",
            onPress: () => {
              setShowSuccessAlert(false);
              console.log("Alert OK pressed");
            },
          },
        ])}

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
              renderItem={({ item }) => (
                <RelationshipItem
                  item={item}
                  onSelect={handleSelectRelationship}
                />
              )}
              keyExtractor={(item) => item.id}
              style={styles.relationshipList}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Define relationship options with enum values
const relationshipOptions = [
  { id: "1", label: "Bố", value: "FAMILY" },
  { id: "2", label: "Mẹ", value: "FAMILY" },
  { id: "3", label: "Anh ruột", value: "FAMILY" },
  { id: "4", label: "Chị ruột", value: "FAMILY" },
  { id: "5", label: "Em trai", value: "FAMILY" },
  { id: "6", label: "Em gái", value: "FAMILY" },
  { id: "7", label: "Vợ", value: "FAMILY" },
  { id: "8", label: "Chồng", value: "FAMILY" },
  { id: "9", label: "Con", value: "FAMILY" },
  { id: "10", label: "Bạn", value: "FRIEND" },
  { id: "11", label: "Họ hàng khác", value: "OTHERS" },
];

const RelationshipItem = ({
  item,
  onSelect,
}: {
  item: { id: string; label: string; value: string };
  onSelect: (value: string) => void;
}) => (
  <TouchableOpacity
    style={styles.relationshipItem}
    onPress={() => onSelect(item.value)}
  >
    <Text style={styles.relationshipItemText}>{item.label}</Text>
    {formState.emergencyContactRelationship === item.value && (
      <Ionicons name="checkmark" size={20} color="#0BC5C5" />
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
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
    marginBottom: 20,
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
    color: "#111827",
  },
  dropdownTextSelected: {
    fontFamily: fontFamily.medium,
    color: "#111827",
  },
  placeholderText: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
  saveButton: {
    backgroundColor: "#0BC5C5",
    borderRadius: 8,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 32,
    opacity: 1,
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
  contactItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoLabel: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: "#6B7280",
    marginRight: 8,
  },
  infoValue: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: "#111827",
  },
  editButton: {
    backgroundColor: "#0BC5C5",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    marginTop: 8,
  },
  editButtonText: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: "#FFFFFF",
  },
  addButton: {
    backgroundColor: "#34A853",
    borderRadius: 8,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 16,
  },
  addButtonText: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: "#FFFFFF",
  },
});

export default EditAccountInfoScreen;
