// DoctorBookAppointmentScreen.tsx
"use client"

import React, { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, FlatList, ScrollView, StyleSheet, SafeAreaView, Alert, ActivityIndicator } from "react-native"
import { StackNavigationProp } from "@react-navigation/stack"
import { RouteProp } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { BookAppointmentStackParamList, DateOption, Doctor, DoctorDto } from "../types"
import { globalStyles, colors } from "../../../styles/globalStyles"
import Header from "../../../components/Header"
import { DateCard } from "./DateCard"
import { TimeSlot } from "./TimeSlot"
import { SimilarDoctorCard } from "./SimilarDoctorCard"
import { DoctorHeader } from "./DoctorHeader"
import { fetchRealTimeDates, fetchTimeSlots } from "../data"
import { useFont, fontFamily } from "../../../context/FontContext"
import { useAuth } from "../../../context/AuthContext"
import Sun from "../../../assets/images/ThoiGian/sun.svg"
import Moon from "../../../assets/images/ThoiGian/moon.svg"
import API from "../../../services/api"

type BookAppointmentScreenProps = {
  navigation: StackNavigationProp<BookAppointmentStackParamList, "BookAppointment">
  route: RouteProp<BookAppointmentStackParamList, "BookAppointment">
}

type DayPart = "morning" | "afternoon"

interface TimeSlotData {
  id: string
  time: string
  available: boolean
  price: string
  isBooked: boolean
  isPast: boolean
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

export const BookAppointmentScreen: React.FC<BookAppointmentScreenProps> = ({ navigation, route }) => {
  const { fontsLoaded } = useFont()
  const { doctor } = route.params
  const { patient } = useAuth()

  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [selectedDayPart, setSelectedDayPart] = useState<DayPart>("morning")
  const [hasInsurance, setHasInsurance] = useState<boolean>(true)
  const [favorites, setFavorites] = useState<string[]>([])
  const [similarDoctors, setSimilarDoctors] = useState<Doctor[]>([])
  const [dates, setDates] = useState<DateOption[]>([])
  const [timeSlots, setTimeSlots] = useState<TimeSlotData[]>([])
  const [selectedScheduleIds, setSelectedScheduleIds] = useState<number[]>([])
  const [isLoadingDates, setIsLoadingDates] = useState<boolean>(false)
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(false)

  // Fetch dates
  useEffect(() => {
    if (!doctor?.id) {
      console.log('[BookAppointmentScreen] Bỏ qua fetchDates: doctor hoặc doctor.id không xác định')
      Alert.alert("Lỗi", "Thông tin bác sĩ không hợp lệ.", [{ text: "OK", onPress: () => navigation.goBack() }])
      return
    }

    const fetchDates = async () => {
      setIsLoadingDates(true)
      try {
        console.log('[BookAppointmentScreen] Đang lấy ngày cho doctorId:', doctor.id)
        const generatedDates = await fetchRealTimeDates(doctor.id, 7)
        console.log('[BookAppointmentScreen] Ngày đã tạo:', JSON.stringify(generatedDates, null, 2))
        
        if (generatedDates.length === 0) {
          Alert.alert(
            "Thông báo",
            `Hiện tại không có lịch làm việc nào khả dụng cho bác sĩ ${doctor.name} trong 7 ngày tới.`,
            [
              { text: "Chọn bác sĩ khác", onPress: () => navigation.goBack() },
              { text: "Thử lại", onPress: () => fetchDates() },
            ]
          )
        }

        setDates(generatedDates)
        if (generatedDates.length > 0 && !selectedDate) {
          const firstAvailableDate = generatedDates.find((date) => !date.disabled)
          if (firstAvailableDate) {
            console.log('[BookAppointmentScreen] Tự động chọn ngày:', firstAvailableDate.id, 'scheduleIds:', firstAvailableDate.scheduleIds)
            setSelectedDate(firstAvailableDate.id)
            setSelectedScheduleIds(firstAvailableDate.scheduleIds || [])
          } else {
            console.warn('[BookAppointmentScreen] Không tìm thấy ngày không bị vô hiệu hóa')
          }
        }
      } catch (error: any) {
        console.error("[BookAppointmentScreen] Lỗi khi lấy ngày:", error.message, error.response?.data)
        Alert.alert(
          "Lỗi",
          error.response?.data?.message || "Không thể tải danh sách ngày. Vui lòng thử lại sau.",
          [
            { text: "Chọn bác sĩ khác", onPress: () => navigation.goBack() },
            { text: "Thử lại", onPress: () => fetchDates() },
          ]
        )
        setDates([])
      } finally {
        setIsLoadingDates(false)
      }
    }

    fetchDates()
  }, [doctor?.id])

  // Fetch time slots
  useEffect(() => {
    if (selectedScheduleIds.length === 0) {
      console.log('[BookAppointmentScreen] Bỏ qua fetchTimeSlots: selectedScheduleIds rỗng')
      setTimeSlots([])
      return
    }

    const fetchSlots = async () => {
      setIsLoadingSlots(true)
      try {
        console.log('[BookAppointmentScreen] Đang lấy khung giờ cho scheduleIds:', selectedScheduleIds)
        const slots = await fetchTimeSlots(selectedScheduleIds)
        console.log('[BookAppointmentScreen] Khung giờ đã tạo:', JSON.stringify(slots, null, 2))
        setTimeSlots(slots)
        if (slots.length === 0) {
          console.warn('[BookAppointmentScreen] Không có khung giờ nào cho scheduleIds:', selectedScheduleIds)
        }
      } catch (error: any) {
        console.error("[BookAppointmentScreen] Lỗi khi lấy khung giờ:", error.message, error.response?.data)
        Alert.alert(
          "Lỗi",
          error.response?.data?.message || "Không thể tải khung giờ khả dụng. Vui lòng thử lại.",
          [
            { text: "OK" },
            { text: "Thử lại", onPress: () => fetchSlots() },
          ]
        )
        setTimeSlots([])
      } finally {
        setIsLoadingSlots(false)
      }
    }

    fetchSlots()
  }, [selectedScheduleIds])

  // Fetch similar doctors
  useEffect(() => {
    if (!doctor?.id || !doctor?.departmentId) {
      console.log('[BookAppointmentScreen] Bỏ qua fetchSimilarDoctors: doctor hoặc departmentId không xác định')
      return
    }

    const fetchSimilarDoctors = async () => {
      try {
        console.log('[BookAppointmentScreen] Đang lấy bác sĩ tương tự cho departmentId:', doctor.departmentId)
        const response = await API.get<DoctorDto[]>(`/doctors/departments/${doctor.departmentId}/doctors`)
        console.log('[BookAppointmentScreen] Phản hồi bác sĩ tương tự:', JSON.stringify(response.data, null, 2))
        const allDoctors = response.data.map((dto) => ({
          id: dto.doctorId.toString(),
          name: [dto.academicDegree, dto.fullName].filter(Boolean).join(" ").trim() || "Bác sĩ chưa có tên",
          specialty: dto.specialization || doctor.specialty,
          departmentId: dto.departmentId.toString(),
          image: { uri: "https://via.placeholder.com/80" },
          price: doctor.price || "150.000 VND",
          room: null,
          rating: 0,
          experience: null,
          isOnline: null,
          joinDate: null,
        }))

        const filteredDoctors = allDoctors.filter((d) => d.id !== doctor.id)
        const shuffledDoctors = filteredDoctors.sort(() => Math.random() - 0.5)
        setSimilarDoctors(shuffledDoctors.slice(0, 4))
      } catch (error: any) {
        console.error("[BookAppointmentScreen] Lỗi khi lấy bác sĩ tương tự:", error.message, error.response?.data)
        Alert.alert(
          "Lỗi",
          error.response?.data?.message || "Không thể tải bác sĩ tương tự.",
          [
            { text: "OK" },
            { text: "Thử lại", onPress: () => fetchSimilarDoctors() },
          ]
        )
        setSimilarDoctors([])
      }
    }

    fetchSimilarDoctors()
  }, [doctor?.id, doctor?.departmentId])

  const handleDateSelect = (date: DateOption) => {
    if (!date || date.disabled) return
    console.log('[BookAppointmentScreen] Ngày được chọn:', date.id, 'scheduleIds:', date.scheduleIds)
    setSelectedDate(date.id)
    setSelectedTime("")
    setSelectedScheduleIds(date.scheduleIds || [])
  }

  const handleTimeSelect = (time: string) => {
    console.log('[BookAppointmentScreen] Khung giờ được chọn:', time)
    setSelectedTime(time)
  }

  const handleSimilarDoctorPress = (selectedDoctor: Doctor) => {
    if (!selectedDoctor) return
    console.log('[BookAppointmentScreen] Bác sĩ tương tự được chọn:', selectedDoctor.id)
    navigation.replace("BookAppointment", { doctor: selectedDoctor })
  }

  const handleFavoritePress = (doctorId: string) => {
    if (!doctorId) return
    console.log('[BookAppointmentScreen] Chuyển đổi yêu thích cho doctorId:', doctorId)
    setFavorites((prev) => prev.includes(doctorId) ? prev.filter((id) => id !== doctorId) : [...prev, doctorId])
  }

  const handleContinue = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert("Thông báo", "Vui lòng chọn ngày và giờ khám.")
      return
    }

    if (!doctor || selectedScheduleIds.length === 0 || !patient?.patientId) {
      Alert.alert("Lỗi", "Thông tin bác sĩ, lịch hoặc bệnh nhân không hợp lệ.")
      return
    }

    try {
      const [slotStart, slotEnd] = selectedTime.split(" - ").map((t) => `${t}:00`)
      const response = await API.get<ScheduleDto[]>(`/doctors/1/schedules`)
      const schedule = response.data.find(s =>
        selectedScheduleIds.includes(s.scheduleId) &&
        s.availableTimeSlots.some(slot => slot.slotStart === slotStart && slot.slotEnd === slotEnd)
      )

      if (!schedule) {
        throw new Error("Không tìm thấy lịch phù hợp với khung giờ được chọn")
      }

      // Chuyển hướng sang SymptomSelectionScreen thay vì gọi API
      navigation.navigate("SymptomSelection", {
        doctor,
        selectedDate,
        selectedTime,
        hasInsurance,
        scheduleId: schedule.scheduleId,
        patientId: patient.patientId,
      })
    } catch (error: any) {
      console.error("[BookAppointmentScreen] Lỗi khi kiểm tra lịch:", error.message, error.response?.data)
      Alert.alert(
        "Lỗi",
        error.response?.data?.message || "Không thể xác thực lịch. Vui lòng thử lại.",
        [{ text: "OK" }]
      )
    }
  }

  // Lọc khung giờ theo buổi
  const morningSlots = timeSlots.filter(slot => {
    const startHour = parseInt(slot.time.split(":")[0])
    return startHour < 12
  })

  const afternoonSlots = timeSlots.filter(slot => {
    const startHour = parseInt(slot.time.split(":")[0])
    return startHour >= 12
  })

  const renderDateItem = ({ item }: { item: DateOption }) => {
    if (!item) return null
    return (
      <DateCard
        date={item}
        isSelected={selectedDate === item.id}
        onPress={() => handleDateSelect(item)}
        showAvailability={true}
        availableSlots={item.availableSlots}
      />
    )
  }

  const renderTimeSlot = (slot: TimeSlotData) => {
    if (!slot) return null
    return (
      <TimeSlot
        key={slot.id}
        time={slot.time}
        isSelected={selectedTime === slot.time}
        isAvailable={slot.available}
        isBooked={slot.isBooked}
        price={slot.price}
        isPast={slot.isPast}
        onPress={() => handleTimeSelect(slot.time)}
      />
    )
  }

  const renderSimilarDoctor = ({ item }: { item: Doctor }) => {
    if (!item) return null
    return (
      <SimilarDoctorCard
        doctor={item}
        onPress={() => handleSimilarDoctorPress(item)}
        showRating={true}
      />
    )
  }

  if (!fontsLoaded || !doctor) {
    console.log('[BookAppointmentScreen] fontsLoaded:', fontsLoaded, 'doctor:', doctor)
    return (
      <SafeAreaView style={globalStyles.container}>
        <Header title="Chọn thời gian khám" showBack={true} onBackPress={() => navigation.goBack()} />
        <View style={styles.loadingContainer}>
          {!fontsLoaded ? (
            <Text style={[styles.loadingText, { fontFamily: fontFamily.regular }]}>Đang tải font...</Text>
          ) : (
            <Text style={[styles.loadingText, { fontFamily: fontFamily.regular }]}>
              Lỗi: Không tìm thấy thông tin bác sĩ. Vui lòng thử lại.
            </Text>
          )}
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <Header title="Chọn thời gian khám" showBack={true} onBackPress={() => navigation.goBack()} />
      <ScrollView style={globalStyles.container} contentContainerStyle={styles.contentContainer}>
        <DoctorHeader
          doctor={doctor}
          showFavorite={true}
          isFavorite={favorites.includes(doctor.id)}
          onFavoritePress={() => handleFavoritePress(doctor.id)}
          showStatus={true}
          isOnline={doctor.isOnline || true}
        />
        
        {/* Date Selection Section */}
        <View style={styles.dateSelectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calendar" size={20} color={colors.primary} />
            <Text style={[styles.selectionTitle, { fontFamily: fontFamily.bold }]}>Chọn ngày khám</Text>
          </View>
          
          {isLoadingDates ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loadingText, { fontFamily: fontFamily.regular }]}>Đang tải lịch làm việc...</Text>
            </View>
          ) : dates.length > 0 ? (
            <FlatList
              data={dates}
              renderItem={renderDateItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dateList}
            />
          ) : (
            <View style={styles.noDataContainer}>
              <View style={styles.emptyStateIcon}>
                <Ionicons name="calendar-outline" size={48} color={colors.gray400} />
              </View>
              <Text style={[styles.noDataText, { fontFamily: fontFamily.semibold }]}>
                Không có lịch làm việc
              </Text>
              <Text style={[styles.noDataSubtext, { fontFamily: fontFamily.regular }]}>
                Vui lòng chọn bác sĩ khác hoặc thử lại sau
              </Text>
              <TouchableOpacity style={styles.retryButton} onPress={() => fetchDates()}>
                <Text style={[styles.retryButtonText, { fontFamily: fontFamily.medium }]}>Thử lại</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Time Slot Selection */}
        {dates.length > 0 && (
          <View style={styles.timeSelectionContainer}>
            <View style={styles.sectionHeader}>
              <Ionicons name="time" size={20} color={colors.primary} />
              <Text style={[styles.selectionTitle, { fontFamily: fontFamily.bold }]}>Chọn giờ khám</Text>
            </View>
            
            {/* Day Part Tabs */}
            <View style={styles.dayPartContainer}>
              <View style={styles.dayPartTabs}>
                <TouchableOpacity
                  style={[styles.dayPartTab, selectedDayPart === "morning" && styles.dayPartTabSelected]}
                  onPress={() => setSelectedDayPart("morning")}
                  activeOpacity={0.8}
                >
                  <View style={[styles.dayPartIcon, selectedDayPart === "morning" && styles.dayPartIconSelected]}>
                    <Sun width={18} height={18} />
                  </View>
                  <Text style={[
                    styles.dayPartText, 
                    { fontFamily: fontFamily.medium },
                    selectedDayPart === "morning" && styles.dayPartTextSelected
                  ]}>
                    Buổi sáng
                  </Text>
                  {morningSlots.length > 0 && (
                    <View style={styles.availableBadge}>
                      <Text style={[styles.availableBadgeText, { fontFamily: fontFamily.medium }]}>
                        {morningSlots.filter(slot => slot.available).length}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.dayPartTab, selectedDayPart === "afternoon" && styles.dayPartTabSelected]}
                  onPress={() => setSelectedDayPart("afternoon")}
                  activeOpacity={0.8}
                >
                  <View style={[styles.dayPartIcon, selectedDayPart === "afternoon" && styles.dayPartIconSelected]}>
                    <Moon width={18} height={18} />
                  </View>
                  <Text style={[
                    styles.dayPartText, 
                    { fontFamily: fontFamily.medium },
                    selectedDayPart === "afternoon" && styles.dayPartTextSelected
                  ]}>
                    Buổi chiều
                  </Text>
                  {afternoonSlots.length > 0 && (
                    <View style={styles.availableBadge}>
                      <Text style={[styles.availableBadgeText, { fontFamily: fontFamily.medium }]}>
                        {afternoonSlots.filter(slot => slot.available).length}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Time Slots Grid */}
            {isLoadingSlots ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.loadingText, { fontFamily: fontFamily.regular }]}>Đang tải khung giờ...</Text>
              </View>
            ) : (selectedDayPart === "morning" ? morningSlots : afternoonSlots).length > 0 ? (
              <View style={styles.timeSlotWrapper}>
                <View style={styles.timeSlotGrid}>
                  {(selectedDayPart === "morning" ? morningSlots : afternoonSlots).map((slot) => renderTimeSlot(slot))}
                </View>
              </View>
            ) : selectedDate ? (
              <View style={styles.noSlotsContainer}>
                <View style={styles.emptyStateIcon}>
                  <Ionicons name="time-outline" size={40} color={colors.gray400} />
                </View>
                <Text style={[styles.noDataText, { fontFamily: fontFamily.medium }]}>
                  Không có khung giờ {selectedDayPart === "morning" ? "buổi sáng" : "buổi chiều"}
                </Text>
                <Text style={[styles.noDataSubtext, { fontFamily: fontFamily.regular }]}>
                  Thử chọn {selectedDayPart === "morning" ? "buổi chiều" : "buổi sáng"} hoặc ngày khác
                </Text>
              </View>
            ) : null}
          </View>
        )}

        {/* Insurance Section */}
        <View style={styles.insuranceContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
            <Text style={[styles.selectionTitle, { fontFamily: fontFamily.bold }]}>Bảo hiểm y tế</Text>
          </View>
          
          <View style={styles.insuranceCard}>
            <View style={styles.insuranceOptions}>
              <TouchableOpacity 
                style={[styles.insuranceOption, hasInsurance && styles.insuranceOptionSelected]} 
                onPress={() => setHasInsurance(true)}
                activeOpacity={0.8}
              >
                <View style={[styles.radioButton, hasInsurance && styles.radioButtonSelected]}>
                  {hasInsurance && <View style={styles.radioButtonInner} />}
                </View>
                <Text style={[styles.insuranceText, { fontFamily: fontFamily.medium }]}>Có bảo hiểm</Text>
                <Ionicons name="shield" size={16} color={hasInsurance ? colors.primary : colors.gray400} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.insuranceOption, !hasInsurance && styles.insuranceOptionSelected]} 
                onPress={() => setHasInsurance(false)}
                activeOpacity={0.8}
              >
                <View style={[styles.radioButton, !hasInsurance && styles.radioButtonSelected]}>
                  {!hasInsurance && <View style={styles.radioButtonInner} />}
                </View>
                <Text style={[styles.insuranceText, { fontFamily: fontFamily.medium }]}>Không có</Text>
                <Ionicons name="card" size={16} color={!hasInsurance ? colors.primary : colors.gray400} />
              </TouchableOpacity>
            </View>
            
            {hasInsurance && (
              <View style={styles.insuranceNote}>
                <Ionicons name="information-circle" size={16} color={colors.blue500} />
                <Text style={[styles.insuranceNoteText, { fontFamily: fontFamily.regular }]}>
                  Vui lòng mang theo thẻ bảo hiểm y tế khi đến khám
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Similar Doctors */}
        {similarDoctors.length > 0 && (
          <View style={styles.similarDoctorsContainer}>
            <Text style={[styles.similarDoctorsTitle, { fontFamily: fontFamily.bold }]}>
              Bác sĩ {doctor.specialty} tương tự
            </Text>
            <FlatList
              data={similarDoctors}
              renderItem={renderSimilarDoctor}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.similarDoctorsList}
            />
          </View>
        )}

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.continueButton, (!selectedDate || !selectedTime) && styles.buttonDisabled]}
            onPress={handleContinue}
            disabled={!selectedDate || !selectedTime}
            activeOpacity={0.8}
          >
            <Text style={[styles.buttonText, { fontFamily: fontFamily.bold }]}>
              Tiếp tục
            </Text>
            <Ionicons name="arrow-forward" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  selectionTitle: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
  },
  dateSelectionContainer: {
    backgroundColor: colors.white,
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dateList: {
    paddingVertical: 8,
  },
  timeSelectionContainer: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dayPartContainer: {
    marginBottom: 20,
  },
  dayPartTabs: {
    flexDirection: "row",
    backgroundColor: colors.gray100,
    borderRadius: 12,
    padding: 4,
  },
  dayPartTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    position: "relative",
    backgroundColor: "transparent",
  },
  dayPartTabSelected: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  dayPartIcon: {
    marginRight: 8,
    opacity: 0.6,
  },
  dayPartIconSelected: {
    opacity: 1,
  },
  dayPartText: {
    fontSize: 14,
    color: colors.gray600,
  },
  dayPartTextSelected: {
    color: colors.white,
    fontWeight: "600",
  },
  availableBadge: {
    position: "absolute",
    top: -2,
    right: 8,
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  availableBadgeText: {
    fontSize: 11,
    color: colors.white,
    lineHeight: 14,
  },
  timeSlotWrapper: {
    marginTop: 8,
  },
  timeSlotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  timeSlotItem: {
    width: "31%",
    marginBottom: 12,
  },
  insuranceContainer: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  insuranceCard: {
    marginTop: 8,
  },
  insuranceOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  insuranceOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 6,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.gray200,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  insuranceOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + "08",
    shadowColor: colors.primary,
    shadowOpacity: 0.15,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.gray300,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioButtonSelected: {
    borderColor: colors.primary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  insuranceText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  insuranceNote: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.blue50,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.blue500,
  },
  insuranceNoteText: {
    fontSize: 12,
    color: colors.blue700,
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  similarDoctorsContainer: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  similarDoctorsTitle: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
  },
  similarDoctorsList: {
    paddingVertical: 8,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  continueButton: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: colors.gray400,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    fontSize: 16,
    color: colors.white,
    marginRight: 8,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 14,
    color: colors.gray600,
    marginTop: 12,
    textAlign: "center",
  },
  noDataContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  noSlotsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.gray100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  noDataText: {
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
    marginBottom: 8,
  },
  noDataSubtext: {
    fontSize: 14,
    color: colors.gray600,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    color: colors.white,
  },
})