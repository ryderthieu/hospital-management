"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { View, Text, TouchableOpacity, FlatList, ScrollView, StyleSheet, SafeAreaView, Alert } from "react-native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RouteProp } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import type { RootStackParamList, DateOption, Doctor } from "../types"
import { globalStyles, colors } from "../../../styles/globalStyles"
import Header from "../../../components/Header"
import { DateCard } from "./DateCard"
import { TimeSlot } from "./TimeSlot"
import { SimilarDoctorCard } from "./SimilarDoctorCard"
import { DoctorHeader } from "./DoctorHeader"
import { getSimilarDoctors, generateRealTimeDates, generateTimeSlots } from "../data"
import { useFont, fontFamily } from "../../../context/FontContext"
import Sun from "../../../assets/images/ThoiGian/sun.svg"
import Moon from "../../../assets/images/ThoiGian/moon.svg"

type BookAppointmentScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "BookAppointment">
  route: RouteProp<RootStackParamList, "BookAppointment">
}

type DayPart = "morning" | "afternoon"

export const BookAppointmentScreen: React.FC<BookAppointmentScreenProps> = ({ navigation, route }) => {
  const { fontsLoaded } = useFont()
  const { doctor } = route.params

  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [selectedDayPart, setSelectedDayPart] = useState<DayPart>("morning")
  const [hasInsurance, setHasInsurance] = useState<boolean>(true)
  const [favorites, setFavorites] = useState<string[]>([])

  const dates = useMemo(() => {
    try {
      const generatedDates = generateRealTimeDates(7) || []
      if (!selectedDate && generatedDates.length > 0) {
        setSelectedDate(generatedDates[0].id)
      }
      return generatedDates
    } catch (error) {
      console.error("Error generating dates:", error)
      return []
    }
  }, [selectedDate])

  const timeSlots = useMemo(() => {
    if (!selectedDate) return []

    try {
      const slots = generateTimeSlots(selectedDate)
      if (!slots || !Array.isArray(slots)) {
        console.warn("generateTimeSlots returned invalid data:", slots)
        return []
      }

      return slots.filter((slot) => {
        if (!slot || !slot.time) return false

        const timeParts = slot.time.split(":")
        if (timeParts.length < 2) return false

        const hour = Number.parseInt(timeParts[0])
        const isPM = slot.time.includes("PM")
        const hour24 = isPM && hour !== 12 ? hour + 12 : hour === 12 && !isPM ? 0 : hour

        if (selectedDayPart === "morning") {
          return hour24 >= 8 && hour24 < 12
        } else {
          return hour24 >= 13 && hour24 <= 17
        }
      })
    } catch (error) {
      console.error("Error generating time slots:", error)
      return []
    }
  }, [selectedDate, selectedDayPart])

  const similarDoctors = useMemo(() => {
    try {
      if (!doctor || !doctor.id || !doctor.specialty) {
        return []
      }
      const similar = getSimilarDoctors(doctor.id, doctor.specialty, 4)
      return Array.isArray(similar) ? similar : []
    } catch (error) {
      console.error("Error getting similar doctors:", error)
      return []
    }
  }, [doctor])

  const handleDateSelect = (date: DateOption) => {
    if (!date || date.disabled) return
    setSelectedDate(date.id)
    setSelectedTime("") 
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleDayPartSelect = (dayPart: DayPart) => {
    setSelectedDayPart(dayPart)
    setSelectedTime("") 
  }

  const handleSimilarDoctorPress = (selectedDoctor: Doctor) => {
    if (!selectedDoctor) return
    navigation.replace("BookAppointment", { doctor: selectedDoctor })
  }

  const handleFavoritePress = (doctorId: string) => {
    if (!doctorId) return
    setFavorites((prev) => (prev.includes(doctorId) ? prev.filter((id) => id !== doctorId) : [...prev, doctorId]))
  }

  const handleContinue = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert("Thông báo", "Vui lòng chọn ngày và giờ khám.", [{ text: "OK" }])
      return
    }

    if (!doctor) {
      Alert.alert("Lỗi", "Thông tin bác sĩ không hợp lệ.", [{ text: "OK" }])
      return
    }

    navigation.navigate("SymptomSelection", {
      doctor,
      selectedDate,
      selectedTime,
      hasInsurance,
    })
  }

  const renderDateItem = ({ item }: { item: DateOption }) => {
    if (!item) return null
    return (
      <DateCard
        date={item}
        isSelected={selectedDate === item.id}
        onPress={() => handleDateSelect(item)}
        showAvailability={true}
        availableSlots={Math.floor(Math.random() * 8) + 1} 
      />
    )
  }

  const renderTimeSlot = (slot: any) => {
    if (!slot) return null
    return (
      <TimeSlot
        key={slot.id || slot.time}
        time={slot.time}
        isSelected={selectedTime === slot.time}
        isAvailable={slot.available}
        price={slot.price}
        onPress={() => handleTimeSelect(slot.time)}
      />
    )
  }

  const renderSimilarDoctor = ({ item }: { item: Doctor }) => {
    if (!item) return null
    return <SimilarDoctorCard doctor={item} onPress={() => handleSimilarDoctorPress(item)} showRating={true} />
  }

  if (!fontsLoaded || !doctor) {
    return null
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <Header title="Chọn thời gian khám" showBack={true} onBackPress={() => navigation.goBack()} />

      <ScrollView
        style={globalStyles.container}
        contentContainerStyle={styles.bookingContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Doctor Information */}
        <DoctorHeader
          doctor={doctor}
          showFavorite={true}
          isFavorite={favorites.includes(doctor.id)}
          onFavoritePress={() => handleFavoritePress(doctor.id)}
          showStatus={true}
          isOnline={true}
        />

        {/* Date and Time Selection */}
        <View style={styles.dateSelectionContainer}>
          <Text style={[styles.selectionTitle, { fontFamily: fontFamily.bold }]}>CHỌN THỜI GIAN</Text>

          {/* Date Selection */}
          {dates.length > 0 && (
            <FlatList
              data={dates}
              renderItem={renderDateItem}
              keyExtractor={(item) => item?.id || Math.random().toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dateList}
            />
          )}

          {/* Day Part Selection */}
          <View style={styles.dayPartSelection}>
            <TouchableOpacity
              style={[styles.dayPartButton, selectedDayPart === "morning" && styles.selectedDayPartButton]}
              onPress={() => handleDayPartSelect("morning")}
              activeOpacity={0.7}
            >
              <Sun width={24} height={24} />
              <Text
                style={[
                  styles.dayPartText,
                  { fontFamily: fontFamily.bold },
                  selectedDayPart === "morning" && styles.selectedDayPartText,
                ]}
              >
                Sáng
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.dayPartButton, selectedDayPart === "afternoon" && styles.selectedDayPartButton]}
              onPress={() => handleDayPartSelect("afternoon")}
              activeOpacity={0.7}
            >
              <Moon width={24} height={24} />
              <Text
                style={[
                  styles.dayPartText,
                  { fontFamily: fontFamily.bold },
                  selectedDayPart === "afternoon" && styles.selectedDayPartText,
                ]}
              >
                Chiều
              </Text>
            </TouchableOpacity>
          </View>

          {/* Time Slot Grid */}
          <View style={styles.timeSlotGrid}>{timeSlots.length > 0 ? timeSlots.map(renderTimeSlot) : null}</View>

          {timeSlots.length === 0 && selectedDate && (
            <View style={styles.noSlotsContainer}>
              <Ionicons name="calendar-outline" size={48} color={colors.textSecondary} />
              <Text style={[styles.noSlotsText, { fontFamily: fontFamily.medium }]}>
                Không có khung giờ nào khả dụng cho {selectedDayPart === "morning" ? "buổi sáng" : "buổi chiều"}
              </Text>
              <Text style={[styles.noSlotsSubtext, { fontFamily: fontFamily.regular }]}>
                Vui lòng chọn buổi khác hoặc ngày khác
              </Text>
            </View>
          )}
        </View>

        {/* Insurance Selection */}
        <View style={styles.insuranceContainer}>
          <Text style={[styles.insuranceLabel, { fontFamily: fontFamily.bold }]}>Bảo hiểm Y Tế</Text>
          <View style={styles.insuranceOptions}>
            <TouchableOpacity style={styles.insuranceOption} onPress={() => setHasInsurance(true)} activeOpacity={0.7}>
              <View style={[styles.checkbox, hasInsurance && styles.checkedBox]}>
                {hasInsurance && <Ionicons name="checkmark" size={14} color="#fff" />}
              </View>
              <Text style={[styles.insuranceText, { fontFamily: fontFamily.medium }]}>Có bảo hiểm</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.insuranceOption} onPress={() => setHasInsurance(false)} activeOpacity={0.7}>
              <View style={[styles.checkbox, !hasInsurance && styles.checkedBox]}>
                {!hasInsurance && <Ionicons name="checkmark" size={14} color="#fff" />}
              </View>
              <Text style={[styles.insuranceText, { fontFamily: fontFamily.medium }]}>Không có</Text>
            </TouchableOpacity>
          </View>

          {hasInsurance && (
            <Text style={[styles.insuranceNote, { fontFamily: fontFamily.regular }]}>
              Vui lòng mang theo thẻ bảo hiểm Y tế khi đến khám
            </Text>
          )}
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
              keyExtractor={(item) => item?.id || Math.random().toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.similarDoctorsList}
            />
          </View>
        )}

        {/* Continue Button */}
        <TouchableOpacity
          style={[globalStyles.button, (!selectedDate || !selectedTime) && styles.disabledButton]}
          onPress={handleContinue}
          disabled={!selectedDate || !selectedTime}
        >
          <Text style={[globalStyles.buttonText, { fontFamily: fontFamily.bold }]}>Tiếp theo</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  bookingContainer: {
    paddingBottom: 24,
  },
  dateSelectionContainer: {
    backgroundColor: colors.base50,
    padding: 16,
    marginBottom: 16,
  },
  selectionTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  dateList: {
    paddingVertical: 8,
  },
  dayPartSelection: {
    flexDirection: "row",
    gap: 12,
    marginVertical: 16,
  },
  dayPartButton: {
    flexDirection: "row",
    gap: 12,
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.base900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedDayPartButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayPartText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  selectedDayPartText: {
    color: colors.white,
  },
  timeSlotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  noSlotsContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  noSlotsText: {
    fontSize: 16,
    color: colors.text,
    marginTop: 16,
    textAlign: "center",
  },
  noSlotsSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: "center",
  },
  insuranceContainer: {
    padding: 16,
    marginBottom: 16,
  },
  insuranceLabel: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
  },
  insuranceOptions: {
    flexDirection: "row",
    gap: 24,
  },
  insuranceOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  checkedBox: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  insuranceText: {
    fontSize: 16,
    color: colors.text,
  },
  insuranceNote: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 12,
    fontStyle: "italic",
  },
  similarDoctorsContainer: {
    padding: 16,
    marginBottom: 16,
  },
  similarDoctorsTitle: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
  },
  similarDoctorsList: {
    paddingVertical: 8,
  },
  summaryContainer: {
    padding: 16,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
    textAlign: "right",
  },
  summaryPrice: {
    fontSize: 14,
    color: colors.primary,
  },
  disabledButton: {
    opacity: 0.5,
  },
})
