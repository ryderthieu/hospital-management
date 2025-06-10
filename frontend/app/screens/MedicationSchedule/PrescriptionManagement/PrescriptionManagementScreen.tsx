"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  StatusBar,
  Modal,
  Platform,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { fontFamily } from "../../../context/FontContext"
import Header from "../../../components/Header"
import { colors } from "../../../styles/globalStyles"
import type { Prescription } from "../type"
import API from "../../../services/api"
import { useAuth } from "../../../context/AuthContext"

// Định nghĩa kiểu dữ liệu từ backend
interface BackendPrescription {
  prescriptionId: number;
  appointmentId: number;
  patientId: number;
  followUpDate: string | null;
  isFollowUp: boolean;
  diagnosis: string;
  systolicBloodPressure: number;
  diastolicBloodPressure: number;
  heartRate: number;
  bloodSugar: number;
  note: string | null;
  createdAt: string;
  prescriptionDetails: {
    detailId: number;
    prescriptionId: number;
    medicine: {
      medicineId: number;
      medicineName: string;
      unit: string;
    };
    dosage: string;
    frequency: string;
    duration: string;
    prescriptionNotes: string | null;
    quantity: number;
    createdAt: string;
  }[];
}

// Hàm ánh xạ dữ liệu từ backend sang frontend
const mapBackendToFrontendPrescription = (backend: BackendPrescription): Prescription => ({
  id: backend.prescriptionId.toString(),
  specialty: backend.diagnosis, // Có thể cần API bác sĩ để lấy chuyên khoa chính xác
  examinationDate: new Date(backend.createdAt).toLocaleDateString("vi-VN"),
  doctor: "Unknown", // Cần gọi API bác sĩ để lấy tên bác sĩ
})

const PrescriptionManagementScreen: React.FC = () => {
  const { patient } = useAuth()
  const navigation = useNavigation()
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [fromDate, setFromDate] = useState(new Date(2025, 9, 9))
  const [toDate, setToDate] = useState(new Date(2025, 10, 9))
  const [fromDateText, setFromDateText] = useState("09-10-2025")
  const [toDateText, setToDateText] = useState("09-11-2025")
  const [activeFilter, setActiveFilter] = useState<"today" | "week" | "month" | null>(null)
  const [showFromDatePicker, setShowFromDatePicker] = useState(false)
  const [showToDatePicker, setShowToDatePicker] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchPrescriptions = async () => {
    if (!patient?.patientId) {
      console.error("Không tìm thấy patientId")
      return
    }
    setLoading(true)
    try {
      const response = await API.get(`/pharmacy/prescriptions/patient/${patient.patientId}`)
      const backendPrescriptions: BackendPrescription[] = response.data
      const frontendPrescriptions = backendPrescriptions.map(mapBackendToFrontendPrescription)
      setPrescriptions(frontendPrescriptions)
    } catch (error) {
      console.error("Lỗi khi lấy đơn thuốc:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrescriptions()
  }, [patient?.patientId])

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  const handleFromDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowFromDatePicker(false)
    }
    if (selectedDate) {
      setFromDate(selectedDate)
      setFromDateText(formatDate(selectedDate))
    }
  }

  const handleToDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowToDatePicker(false)
    }
    if (selectedDate) {
      setToDate(selectedDate)
      setToDateText(formatDate(selectedDate))
    }
  }

  const handleFilterPress = (filter: "today" | "week" | "month") => {
    setActiveFilter(filter)
    const today = new Date()
    if (filter === "today") {
      setFromDate(today)
      setToDate(today)
      setFromDateText(formatDate(today))
      setToDateText(formatDate(today))
    } else if (filter === "week") {
      const weekStart = new Date(today)
      const weekEnd = new Date(today)
      const day = today.getDay() || 7
      weekStart.setDate(today.getDate() - day + 1)
      weekEnd.setDate(today.getDate() + (7 - day))
      setFromDate(weekStart)
      setToDate(weekEnd)
      setFromDateText(formatDate(weekStart))
      setToDateText(formatDate(weekEnd))
    } else if (filter === "month") {
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      setFromDate(monthStart)
      setToDate(monthEnd)
      setFromDateText(formatDate(monthStart))
      setToDateText(formatDate(monthEnd))
    }
  }

  const handleReset = () => {
    setFromDate(new Date())
    setToDate(new Date())
    setFromDateText("")
    setToDateText("")
    setActiveFilter(null)
  }

  const handleSearch = () => {
    console.log("Tìm kiếm với ngày:", fromDateText, toDateText)
    fetchPrescriptions()
  }

  const handlePrescriptionPress = (prescription: Prescription) => {
    navigation.navigate("PrescriptionDetails", { prescriptionId: prescription.id })
  }

  const renderPrescriptionItem = ({ item }: { item: Prescription }) => (
    <TouchableOpacity style={styles.prescriptionCard} onPress={() => handlePrescriptionPress(item)}>
      <View style={styles.prescriptionContent}>
        <View style={styles.prescriptionRow}>
          <Text style={[styles.prescriptionLabel, { fontFamily: fontFamily.regular }]}>Chuyên khoa:</Text>
          <Text style={[styles.prescriptionValue, { fontFamily: fontFamily.medium }]}>{item.specialty}</Text>
        </View>
        <View style={styles.prescriptionRow}>
          <Text style={[styles.prescriptionLabel, { fontFamily: fontFamily.regular }]}>Ngày khám:</Text>
          <Text style={[styles.prescriptionValue, { fontFamily: fontFamily.medium }]}>{item.examinationDate}</Text>
        </View>
        <View style={styles.prescriptionRow}>
          <Text style={[styles.prescriptionLabel, { fontFamily: fontFamily.regular }]}>Bác sĩ:</Text>
          <Text style={[styles.prescriptionValue, { fontFamily: fontFamily.medium }]}>{item.doctor}</Text>
        </View>
      </View>
      <View style={styles.chevronContainer}>
        <View style={styles.chevron}>
          <View style={styles.chevronLine1} />
          <View style={styles.chevronLine2} />
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header title="Quản lý đơn thuốc" showBack={true} onBackPress={() => navigation.goBack()} />
      <View style={styles.content}>
        <View style={styles.filterContainer}>
          <View style={styles.filterHeader}>
            <Text style={[styles.filterTitle, { fontFamily: fontFamily.medium }]}>Khoảng thời gian</Text>
            <TouchableOpacity onPress={handleReset}>
              <Text style={[styles.resetButton, { fontFamily: fontFamily.medium }]}>Đặt lại</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.dateRangeContainer}>
            <View style={styles.dateInputContainer}>
              <Text style={[styles.dateLabel, { fontFamily: fontFamily.regular }]}>Từ ngày</Text>
              <View style={styles.dateInputWrapper}>
                <TextInput
                  style={[styles.dateInput, { fontFamily: fontFamily.regular }]}
                  value={fromDateText}
                  onChangeText={setFromDateText}
                  placeholder="DD-MM-YYYY"
                  editable={false}
                />
                <TouchableOpacity style={styles.calendarIconContainer} onPress={() => setShowFromDatePicker(true)}>
                  <View style={styles.calendarIcon}>
                    <View style={styles.calendarRing1} />
                    <View style={styles.calendarRing2} />
                    <View style={styles.calendarBody} />
                    <View style={styles.calendarHeader} />
                    <View style={styles.calendarDot1} />
                    <View style={styles.calendarDot2} />
                    <View style={styles.calendarDot3} />
                    <View style={styles.calendarDot4} />
                    <View style={styles.calendarDot5} />
                    <View style={styles.calendarDot6} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.dateInputContainer}>
              <Text style={[styles.dateLabel, { fontFamily: fontFamily.regular }]}>Đến ngày</Text>
              <View style={styles.dateInputWrapper}>
                <TextInput
                  style={[styles.dateInput, { fontFamily: fontFamily.regular }]}
                  value={toDateText}
                  onChangeText={setToDateText}
                  placeholder="DD-MM-YYYY"
                  editable={false}
                />
                <TouchableOpacity style={styles.calendarIconContainer} onPress={() => setShowToDatePicker(true)}>
                  <View style={styles.calendarIcon}>
                    <View style={styles.calendarRing1} />
                    <View style={styles.calendarRing2} />
                    <View style={styles.calendarBody} />
                    <View style={styles.calendarHeader} />
                    <View style={styles.calendarDot1} />
                    <View style={styles.calendarDot2} />
                    <View style={styles.calendarDot3} />
                    <View style={styles.calendarDot4} />
                    <View style={styles.calendarDot5} />
                    <View style={styles.calendarDot6} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.quickFiltersContainer}>
            <TouchableOpacity
              style={[styles.quickFilterButton, activeFilter === "today" && styles.activeQuickFilterButton]}
              onPress={() => handleFilterPress("today")}
            >
              <Text
                style={[
                  styles.quickFilterText,
                  { fontFamily: fontFamily.regular },
                  activeFilter === "today" && styles.activeQuickFilterText,
                ]}
              >
                Hôm nay
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.quickFilterButton, activeFilter === "week" && styles.activeQuickFilterButton]}
              onPress={() => handleFilterPress("week")}
            >
              <Text
                style={[
                  styles.quickFilterText,
                  { fontFamily: fontFamily.regular },
                  activeFilter === "week" && styles.activeQuickFilterText,
                ]}
              >
                Tuần này
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.quickFilterButton, activeFilter === "month" && styles.activeQuickFilterButton]}
              onPress={() => handleFilterPress("month")}
            >
              <Text
                style={[
                  styles.quickFilterText,
                  { fontFamily: fontFamily.regular },
                  activeFilter === "month" && styles.activeQuickFilterText,
                ]}
              >
                Tháng này
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={[styles.searchButtonText, { fontFamily: fontFamily.medium }]}>Tìm kiếm</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.prescriptionListContainer}>
          <Text style={[styles.prescriptionListTitle, { fontFamily: fontFamily.medium }]}>
            Danh sách đơn thuốc ({prescriptions.length})
          </Text>
          {loading ? (
            <Text style={[styles.loadingText, { fontFamily: fontFamily.regular }]}>Đang tải...</Text>
          ) : (
            <FlatList
              data={prescriptions}
              renderItem={renderPrescriptionItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.prescriptionList}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
      {Platform.OS === "ios" ? (
        <Modal visible={showFromDatePicker || showToDatePicker} transparent animationType="slide">
          <View style={styles.datePickerModalContainer}>
            <View style={styles.datePickerModalContent}>
              <View style={styles.datePickerHeader}>
                <TouchableOpacity
                  onPress={() => {
                    setShowFromDatePicker(false)
                    setShowToDatePicker(false)
                  }}
                >
                  <Text style={styles.datePickerCancelButton}>Hủy</Text>
                </TouchableOpacity>
                <Text style={styles.datePickerTitle}>
                  {showFromDatePicker ? "Chọn ngày bắt đầu" : "Chọn ngày kết thúc"}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowFromDatePicker(false)
                    setShowToDatePicker(false)
                  }}
                >
                  <Text style={styles.datePickerDoneButton}>Xong</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={showFromDatePicker ? fromDate : toDate}
                mode="date"
                display="spinner"
                onChange={showFromDatePicker ? handleFromDateChange : handleToDateChange}
                style={styles.datePickerIOS}
              />
            </View>
          </View>
        </Modal>
      ) : (
        <>
          {showFromDatePicker && (
            <DateTimePicker value={fromDate} mode="date" display="default" onChange={handleFromDateChange} />
          )}
          {showToDatePicker && (
            <DateTimePicker value={toDate} mode="date" display="default" onChange={handleToDateChange} />
          )}
        </>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  filterContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  resetButton: {
    fontSize: 14,
    color: colors.base500,
    fontWeight: "500",
  },
  dateRangeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  dateInputContainer: {
    width: "48%",
  },
  dateLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  dateInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    overflow: "hidden",
  },
  dateInput: {
    flex: 1,
    height: 44,
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#333",
  },
  calendarIconContainer: {
    width: 44,
    height: 44,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  calendarIcon: {
    width: 20,
    height: 20,
    position: "relative",
  },
  calendarRing1: {
    position: "absolute",
    top: -2,
    left: 4,
    width: 3,
    height: 6,
    backgroundColor: "#666",
    borderRadius: 1.5,
  },
  calendarRing2: {
    position: "absolute",
    top: -2,
    right: 4,
    width: 3,
    height: 6,
    backgroundColor: "#666",
    borderRadius: 1.5,
  },
  calendarBody: {
    position: "absolute",
    top: 2,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#666",
    borderRadius: 2,
  },
  calendarHeader: {
    position: "absolute",
    top: 2,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: "#999",
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  calendarDot1: {
    position: "absolute",
    top: 10,
    left: 3,
    width: 2,
    height: 2,
    backgroundColor: "#fff",
    borderRadius: 1,
  },
  calendarDot2: {
    position: "absolute",
    top: 10,
    left: 9,
    width: 2,
    height: 2,
    backgroundColor: "#fff",
    borderRadius: 1,
  },
  calendarDot3: {
    position: "absolute",
    top: 10,
    right: 3,
    width: 2,
    height: 2,
    backgroundColor: "#fff",
    borderRadius: 1,
  },
  calendarDot4: {
    position: "absolute",
    top: 14,
    left: 3,
    width: 2,
    height: 2,
    backgroundColor: "#fff",
    borderRadius: 1,
  },
  calendarDot5: {
    position: "absolute",
    top: 14,
    left: 9,
    width: 2,
    height: 2,
    backgroundColor: "#fff",
    borderRadius: 1,
  },
  calendarDot6: {
    position: "absolute",
    top: 14,
    right: 3,
    width: 2,
    height: 2,
    backgroundColor: "#fff",
    borderRadius: 1,
  },
  quickFiltersContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  quickFilterButton: {
    flex: 1,
    height: 44,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
  activeQuickFilterButton: {
    backgroundColor: "#E6F7F7",
    borderWidth: 1,
    borderColor: colors.base500,
  },
  quickFilterText: {
    fontSize: 14,
    color: "#666",
  },
  activeQuickFilterText: {
    color: colors.base500,
    fontWeight: "500",
  },
  searchButton: {
    height: 48,
    backgroundColor: colors.base500,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  prescriptionListContainer: {
    flex: 1,
  },
  prescriptionListTitle: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
    marginBottom: 12,
  },
  prescriptionList: {
    paddingBottom: 16,
  },
  prescriptionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  prescriptionContent: {
    flex: 1,
  },
  prescriptionRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  prescriptionLabel: {
    fontSize: 14,
    color: "#666",
    width: 120,
  },
  prescriptionValue: {
    fontSize: 14,
    color: colors.base500,
    flex: 1,
  },
  chevronContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  chevron: {
    width: 12,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  chevronLine1: {
    position: "absolute",
    width: 10,
    height: 2,
    backgroundColor: colors.base500,
    borderRadius: 1,
    transform: [{ rotate: "45deg" }],
    top: 6,
  },
  chevronLine2: {
    position: "absolute",
    width: 10,
    height: 2,
    backgroundColor: colors.base500,
    borderRadius: 1,
    transform: [{ rotate: "-45deg" }],
    bottom: 6,
  },
  datePickerModalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  datePickerModalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20,
  },
  datePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  datePickerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  datePickerCancelButton: {
    fontSize: 14,
    color: "#999",
  },
  datePickerDoneButton: {
    fontSize: 14,
    color: colors.base500,
    fontWeight: "600",
  },
  datePickerIOS: {
    height: 200,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
})

export default PrescriptionManagementScreen