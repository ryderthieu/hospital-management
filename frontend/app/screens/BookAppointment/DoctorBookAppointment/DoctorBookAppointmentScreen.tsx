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
import Sun from "../../../assets/images/ThoiGian/sun.svg"
import Moon from "../../../assets/images/ThoiGian/moon.svg"
import API from "../../../services/api"

type BookAppointmentScreenProps = {
  navigation: StackNavigationProp<BookAppointmentStackParamList, "BookAppointment">
  route: RouteProp<BookAppointmentStackParamList, "BookAppointment">
}

type DayPart = "all" // Chỉ giữ "all" để hiển thị tất cả khung giờ

interface TimeSlotData {
  id: string
  time: string
  available: boolean
  price: string
  isBooked: boolean
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

  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [selectedDayPart] = useState<DayPart>("all") // Mặc định là "all"
  const [hasInsurance, setHasInsurance] = useState<boolean>(true)
  const [favorites, setFavorites] = useState<string[]>([])
  const [similarDoctors, setSimilarDoctors] = useState<Doctor[]>([])
  const [dates, setDates] = useState<DateOption[]>([])
  const [timeSlots, setTimeSlots] = useState<TimeSlotData[]>([])
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null)
  const [isLoadingDates, setIsLoadingDates] = useState<boolean>(false)
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  // Fetch dates
  useEffect(() => {
    if (!doctor?.id) {
      console.log('[BookAppointmentScreen] Skipping fetchDates: doctor or doctor.id is undefined')
      Alert.alert("Lỗi", "Thông tin bác sĩ không hợp lệ.", [{ text: "OK", onPress: () => navigation.goBack() }])
      return
    }

    const fetchDates = async () => {
      setIsLoadingDates(true)
      try {
        console.log('[BookAppointmentScreen] Fetching dates for doctorId:', doctor.id)
        const generatedDates = await fetchRealTimeDates(doctor.id, 7)
        console.log('[BookAppointmentScreen] Generated dates:', JSON.stringify(generatedDates, null, 2))
        
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
            console.log('[BookAppointmentScreen] Auto-selecting date:', firstAvailableDate.id, 'scheduleId:', firstAvailableDate.scheduleId)
            setSelectedDate(firstAvailableDate.id)
            setSelectedScheduleId(firstAvailableDate.scheduleId || null)
          } else {
            console.warn('[BookAppointmentScreen] No non-disabled dates found')
          }
        }
      } catch (error: any) {
        console.error("[BookAppointmentScreen] Error fetching dates:", error.message, error.response?.data)
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
    if (!selectedScheduleId) {
      console.log('[BookAppointmentScreen] Skipping fetchTimeSlots: selectedScheduleId is null')
      setTimeSlots([])
      return
    }

    const fetchSlots = async () => {
      setIsLoadingSlots(true)
      try {
        console.log('[BookAppointmentScreen] Fetching time slots for scheduleId:', selectedScheduleId)
        const slots = await fetchTimeSlots(selectedScheduleId)
        console.log('[BookAppointmentScreen] Generated slots:', JSON.stringify(slots, null, 2))
        setTimeSlots(slots) // Bỏ lọc selectedDayPart để hiển thị tất cả khung giờ
        if (slots.length === 0) {
          console.warn('[BookAppointmentScreen] No slots available for scheduleId:', selectedScheduleId)
        }
      } catch (error: any) {
        console.error("[BookAppointmentScreen] Error fetching time slots:", error.message, error.response?.data)
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
  }, [selectedScheduleId])

  // Fetch similar doctors
  useEffect(() => {
    if (!doctor?.id || !doctor?.departmentId) {
      console.log('[BookAppointmentScreen] Skipping fetchSimilarDoctors: doctor or departmentId is undefined')
      return
    }

    const fetchSimilarDoctors = async () => {
      try {
        console.log('[BookAppointmentScreen] Fetching similar doctors for departmentId:', doctor.departmentId)
        const response = await API.get<DoctorDto[]>(`/doctors/departments/${doctor.departmentId}/doctors`)
        console.log('[BookAppointmentScreen] Similar doctors response:', JSON.stringify(response.data, null, 2))
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
        console.error("[BookAppointmentScreen] Error fetching similar doctors:", error.message, error.response?.data)
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
    console.log('[BookAppointmentScreen] Selected date:', date.id, 'scheduleId:', date.scheduleId)
    setSelectedDate(date.id)
    setSelectedTime("")
    setSelectedScheduleId(date.scheduleId || null)
  }

  const handleTimeSelect = (time: string) => {
    console.log('[BookAppointmentScreen] Selected time:', time)
    setSelectedTime(time)
  }

  const handleSimilarDoctorPress = (selectedDoctor: Doctor) => {
    if (!selectedDoctor) return
    console.log('[BookAppointmentScreen] Selected similar doctor:', selectedDoctor.id)
    navigation.replace("BookAppointment", { doctor: selectedDoctor })
  }

  const handleFavoritePress = (doctorId: string) => {
    if (!doctorId) return
    console.log('[BookAppointmentScreen] Toggled favorite for doctorId:', doctorId)
    setFavorites((prev) => prev.includes(doctorId) ? prev.filter((id) => id !== doctorId) : [...prev, doctorId])
  }

  const handleContinue = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert("Thông báo", "Vui lòng chọn ngày và giờ khám.", [{ text: "OK" }])
      return
    }

    if (!doctor || !selectedScheduleId) {
      Alert.alert("Lỗi", "Thông tin bác sĩ hoặc lịch không hợp lệ.", [{ text: "OK" }])
      return
    }

    setIsSubmitting(true)
    try {
      const [slotStart, slotEnd] = selectedTime.split(" - ").map((t) => `${t}:00`);
      const appointmentRequest: AppointmentRequest = {
        slotStart,
        slotEnd,
        scheduleId: selectedScheduleId,
        symptoms: "", // Sẽ được nhập ở màn hình SymptomSelection
        doctorId: parseInt(doctor.id),
        patientId: 1, // Giả định, cần thay bằng logic lấy patientId từ đăng nhập
      };

      console.log('[BookAppointmentScreen] Creating appointment with:', JSON.stringify(appointmentRequest, null, 2));
      const response = await API.post<AppointmentResponse>("/appointments", appointmentRequest);
      console.log('[BookAppointmentScreen] Appointment created:', JSON.stringify(response.data, null, 2));

      Alert.alert(
        "Thành công",
        "Đặt lịch khám thành công! Vui lòng nhập triệu chứng.",
        [{ text: "OK", onPress: () => navigation.navigate("SymptomSelection", {
          doctor,
          selectedDate,
          selectedTime,
          hasInsurance,
          appointmentId: response.data.appointmentId,
        }) }]
      );
    } catch (error: any) {
      console.error("[BookAppointmentScreen] Error creating appointment:", error.message, error.response?.data)
      Alert.alert(
        "Lỗi",
        error.response?.data?.message || "Không thể đặt lịch khám. Vui lòng thử lại.",
        [{ text: "OK" }]
      );
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderDateItem = ({ item }: { item: DateOption }) => {
    if (!item) return null
    return (
      <DateCard
        date={item}
        isSelected cytotoxins={selectedDate === item.id}
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
        <View style={styles.dateSelectionContainer}>
          <Text style={[styles.selectionTitle, { fontFamily: fontFamily.bold }]}>CHỌN THỜI GIAN</Text>
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
              <Ionicons name="calendar-outline" size={48} color={colors.gray500} />
              <Text style={[styles.noDataText, { fontFamily: fontFamily.medium }]}>
                Không có lịch làm việc nào khả dụng
              </Text>
              <Text style={[styles.noDataSubtext, { fontFamily: fontFamily.regular }]}>
                Vui lòng chọn bác sĩ khác hoặc thử lại sau
              </Text>
              <TouchableOpacity style={[styles.button, styles.retryButton]} onPress={() => fetchDates()}>
                <Text style={[styles.buttonText, { fontFamily: fontFamily.bold }]}>Thử lại</Text>
              </TouchableOpacity>
            </View>
          )}
          {dates.length > 0 && (
            <View style={styles.timeSlotGrid}>
              {isLoadingSlots ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={colors.primary} />
                  <Text style={[styles.loadingText, { fontFamily: fontFamily.regular }]}>Đang tải khung giờ...</Text>
                </View>
              ) : timeSlots.length > 0 ? (
                timeSlots.map((slot) => renderTimeSlot(slot))
              ) : selectedDate ? (
                <View style={styles.noDataContainer}>
                  <Ionicons name="time-outline" size={48} color={colors.gray500} />
                  <Text style={[styles.noDataText, { fontFamily: fontFamily.medium }]}>
                    Không có khung giờ nào khả dụng cho ngày đã chọn
                  </Text>
                  <Text style={[styles.noDataSubtext, { fontFamily: fontFamily.regular }]}>
                    Vui lòng chọn ngày khác
                  </Text>
                </View>
              ) : null}
            </View>
          )}
        </View>
        <View style={styles.insuranceContainer}>
          <Text style={[styles.insuranceTitle, { fontFamily: fontFamily.bold }]}>BẢO HIỂM Y TẾ</Text>
          <View style={styles.insuranceOptions}>
            <TouchableOpacity style={styles.insuranceOption} onPress={() => setHasInsurance(true)}>
              <View style={[styles.radioButton, hasInsurance && styles.radioButtonSelected]}>
                {hasInsurance && <View style={styles.radioButtonInner} />}
              </View>
              <Text style={[styles.insuranceText, { fontFamily: fontFamily.regular }]}>Có bảo hiểm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.insuranceOption} onPress={() => setHasInsurance(false)}>
              <View style={[styles.radioButton, !hasInsurance && styles.radioButtonSelected]}>
                {!hasInsurance && <View style={styles.radioButtonInner} />}
              </View>
              <Text style={[styles.insuranceText, { fontFamily: fontFamily.regular }]}>Không có bảo hiểm</Text>
            </TouchableOpacity>
          </View>
          {hasInsurance && (
            <Text style={[styles.insuranceNote, { fontFamily: fontFamily.regular }]}>
              Vui lòng mang theo thẻ bảo hiểm y tế khi đến khám
            </Text>
          )}
        </View>
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
        <TouchableOpacity
          style={[styles.button, (!selectedDate || !selectedTime || isSubmitting) && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!selectedDate || !selectedTime || isSubmitting}
        >
          <Text style={[styles.buttonText, { fontFamily: fontFamily.bold }]}>{isSubmitting ? "Đang xử lý..." : "Tiếp tục"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 24,
  },
  dateSelectionContainer: {
    backgroundColor: colors.base50,
    padding: 16,
    marginBottom: 24,
  },
  selectionTitle: {
    fontSize: 14,
    color: colors.gray600,
    marginBottom: 16,
    textTransform: "uppercase",
  },
  dateList: {
    paddingVertical: 8,
  },
  timeSlotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  noDataContainer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  noDataText: {
    fontSize: 16,
    color: colors.text,
    marginTop: 8,
    textAlign: "center",
  },
  noDataSubtext: {
    fontSize: 14,
    color: colors.gray600,
    marginTop: 4,
    textAlign: "center",
  },
  insuranceContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  insuranceTitle: {
    fontSize: 14,
    color: colors.gray600,
    marginBottom: 16,
    textTransform: "uppercase",
  },
  insuranceOptions: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 8,
  },
  insuranceOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.gray400,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  radioButtonSelected: {
    borderColor: colors.primary,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  insuranceText: {
    fontSize: 16,
    color: colors.text,
  },
  insuranceNote: {
    fontSize: 12,
    color: colors.gray600,
    fontStyle: "italic",
  },
  similarDoctorsContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  similarDoctorsTitle: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
  },
  similarDoctorsList: {
    paddingVertical: 8,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: colors.gray400,
  },
  retryButton: {
    backgroundColor: colors.gray200,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 16,
  },
  buttonText: {
    fontSize: 16,
    color: colors.white,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  loadingText: {
    fontSize: 14,
    color: colors.gray600,
    marginTop: 8,
  },
})