"use client";

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {
  BookAppointmentStackParamList,
  DateOption,
  Doctor,
  DoctorDto,
} from "../types";
import { globalStyles, colors } from "../../../styles/globalStyles";
import Header from "../../../components/Header";
import { DateCard } from "./DateCard";
import { TimeSlot } from "./TimeSlot";
import { SimilarDoctorCard } from "./SimilarDoctorCard";
import { DoctorHeader } from "./DoctorHeader";
import { fetchRealTimeDates, fetchTimeSlots } from "../data";
import { useFont, fontFamily } from "../../../context/FontContext";
import { useAuth } from "../../../context/AuthContext";
import Sun from "../../../assets/images/ThoiGian/sun.svg";
import Moon from "../../../assets/images/ThoiGian/moon.svg";
import API from "../../../services/api";
import { useAlert } from '../../../context/AlertContext';

type BookAppointmentScreenProps = {
  navigation: StackNavigationProp<
    BookAppointmentStackParamList,
    "BookAppointment"
  >;
  route: RouteProp<BookAppointmentStackParamList, "BookAppointment">;
};

type DayPart = "morning" | "afternoon";

interface TimeSlotData {
  id: string;
  time: string;
  available: boolean;
  price: string;
  isBooked: boolean;
  isPast: boolean;
}

interface AppointmentRequest {
  slotStart: string;
  slotEnd: string;
  scheduleId: number;
  symptoms: string;
  doctorId: number;
  patientId: number;
}

interface AppointmentResponse {
  appointmentId: number;
  doctorId: number;
  schedule: {
    scheduleId: number;
  };
  symptoms: string;
  number: number;
  SlotStart: string;
  SlotEnd: string;
  appointmentStatus: string;
  createdAt: string;
  patientInfo: {
    patientId: number;
  };
  appointmentNotes: any[];
}

export const BookAppointmentScreen: React.FC<BookAppointmentScreenProps> = ({
  navigation,
  route,
}) => {
  const { fontsLoaded } = useFont();
  const { doctor } = route.params;
  const { patient } = useAuth();
  const { showAlert } = useAlert();

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedDayPart, setSelectedDayPart] = useState<DayPart>("morning");
  const [hasInsurance, setHasInsurance] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [similarDoctors, setSimilarDoctors] = useState<Doctor[]>([]);
  const [dates, setDates] = useState<DateOption[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlotData[]>([]);
  const [selectedScheduleIds, setSelectedScheduleIds] = useState<number[]>([]);
  const [isLoadingDates, setIsLoadingDates] = useState<boolean>(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(false);

  // Fetch dates
  useEffect(() => {
    if (!doctor?.id) {
      console.log(
        "[BookAppointmentScreen] Bỏ qua fetchDates: doctor hoặc doctor.id không xác định"
      );
      showAlert({ title: 'Lỗi', message: 'Thông tin bác sĩ không hợp lệ.', buttons: [{ text: "OK", onPress: () => navigation.goBack() }] });
      return;
    }

    const fetchDates = async () => {
      setIsLoadingDates(true);
      try {
        console.log(
          "[BookAppointmentScreen] Đang lấy ngày cho doctorId:",
          doctor.id
        );
        const generatedDates = await fetchRealTimeDates(doctor.id, 7);
        console.log(
          "[BookAppointmentScreen] Ngày đã tạo:",
          JSON.stringify(generatedDates, null, 2)
        );

        // Filter out past dates
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Normalize to start of day
        const filteredDates = generatedDates.map((date) => {
          const dateObj = new Date(date.id);
          return {
            ...date,
            disabled: dateObj < currentDate || date.disabled,
          };
        });

        setDates(filteredDates);
        if (filteredDates.length > 0 && !selectedDate) {
          const firstAvailableDate =
            filteredDates.find(
              (date) => !date.disabled && date.availableSlots > 0
            ) || filteredDates[0];
          console.log(
            "[BookAppointmentScreen] Tự động chọn ngày:",
            firstAvailableDate.id,
            "scheduleIds:",
            firstAvailableDate.scheduleIds
          );
          setSelectedDate(firstAvailableDate.id);
          setSelectedScheduleIds(firstAvailableDate.scheduleIds || []);
        }
      } catch (error: any) {
        console.error(
          "[BookAppointmentScreen] Lỗi khi lấy ngày:",
          error.message,
          error.response?.data
        );
        showAlert({ title: 'Lỗi', message: error.response?.data?.error || 'Không thể tải danh sách ngày. Vui lòng thử lại sau.', buttons: [{ text: "Chọn bác sĩ khác", onPress: () => navigation.goBack() }, { text: "Thử lại", onPress: () => fetchDates() }] });
        setDates([]);
      } finally {
        setIsLoadingDates(false);
      }
    };

    fetchDates();
  }, [doctor?.id]);

  // Fetch time slots
  useEffect(() => {
    if (selectedScheduleIds.length === 0) {
      console.log(
        "[BookAppointmentScreen] Bỏ qua fetchTimeSlots: selectedScheduleIds rỗng"
      );
      setTimeSlots([]);
      return;
    }

    const fetchSlots = async () => {
      setIsLoadingSlots(true);
      try {
        console.log(
          "[BookAppointmentScreen] Đang lấy khung giờ cho scheduleIds:",
          selectedScheduleIds
        );
        const slots = await fetchTimeSlots(selectedScheduleIds);
        console.log(
          "[BookAppointmentScreen] Khung giờ đã tạo:",
          JSON.stringify(slots, null, 2)
        );
        setTimeSlots(slots);
        if (slots.length === 0) {
          console.warn(
            "[BookAppointmentScreen] Không có khung giờ nào cho scheduleIds:",
            selectedScheduleIds
          );
        }
      } catch (error: any) {
        console.error(
          "[BookAppointmentScreen] Lỗi khi lấy khung giờ:",
          error.message,
          error.response?.data
        );
        showAlert({ title: 'Lỗi', message: error.response?.data?.error || 'Không thể tải khung giờ khả dụng. Vui lòng thử lại.', buttons: [{ text: "OK" }, { text: "Thử lại", onPress: () => fetchSlots() }] });
        setTimeSlots([]);
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedScheduleIds]);

  // Fetch similar doctors
  useEffect(() => {
    if (!doctor?.id || !doctor?.departmentId) {
      console.log(
        "[BookAppointmentScreen] Bỏ qua fetchSimilarDoctors: doctor hoặc departmentId không xác định"
      );
      return;
    }

    const fetchSimilarDoctors = async () => {
      try {
        console.log(
          "[BookAppointmentScreen] Đang lấy bác sĩ tương tự cho departmentId:",
          doctor.departmentId
        );
        const response = await API.get<DoctorDto[]>(
          `/doctors/departments/${doctor.departmentId}/doctors`
        );
        console.log(
          "[BookAppointmentScreen] Phản hồi bác sĩ tương tự:",
          JSON.stringify(response.data, null, 2)
        );
        const allDoctors = response.data.map((dto) => {
          const academicPart = dto.academicDegree ? `${dto.academicDegree}` : '';
          const namePart = dto.fullName || '';
          const fullName = [academicPart, namePart]
            .filter(Boolean)
            .join(' ')
            .trim() || 'Bác sĩ chưa có tên';

          // Format consultationFee as VND currency
          const formattedPrice = dto.consultationFee
            ? new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
              }).format(dto.consultationFee)
            : '150.000 VND';

          return {
            id: dto.doctorId.toString(),
            name: fullName,
            specialty: dto.specialization || doctor.specialty || 'Đa khoa',
            departmentId: dto.departmentId?.toString(),
            image: dto.avatar ? { uri: dto.avatar.trim() } : null, // Map avatar to image field
            price: formattedPrice,
            consultationFee: Number(dto.consultationFee) || 0,
            room: null,
            rating: 0,
            experience: null,
            isOnline: false,
            joinDate: null,
            status: 'active',
          };
        });

        const filteredDoctors = allDoctors.filter((d) => d.id !== doctor.id);
        const shuffledDoctors = filteredDoctors.sort(() => Math.random() - 0.5);
        setSimilarDoctors(shuffledDoctors.slice(0, 4));
      } catch (error: any) {
        console.error(
          "[BookAppointmentScreen] Lỗi khi lấy bác sĩ tương tự:",
          error.message,
          error.response?.data
        );
        showAlert({ title: 'Lỗi', message: error.response?.data?.error || 'Không thể tải bác sĩ tương tự.', buttons: [{ text: "OK" }, { text: "Thử lại", onPress: () => fetchSimilarDoctors() }] });
        setSimilarDoctors([]);
      }
    };

    fetchSimilarDoctors();
  }, [doctor?.id, doctor?.departmentId]);

  const handleDateSelect = (date: DateOption) => {
    if (!date || date.disabled) return;
    console.log(
      "[BookAppointmentScreen] Ngày được chọn:",
      date.id,
      "scheduleIds:",
      date.scheduleIds
    );
    setSelectedDate(date.id);
    setSelectedTime("");
    setSelectedScheduleIds(date.scheduleIds || []);
  };

  const handleTimeSelect = (time: string) => {
    const slot = timeSlots.find((s) => s.time === time);
    if (!slot || slot.isPast || slot.isBooked || !slot.available) {
      console.log(
        "[BookAppointmentScreen] Không thể chọn khung giờ:",
        time,
        "isPast:",
        slot?.isPast,
        "isBooked:",
        slot?.isBooked,
        "available:",
        slot?.available
      );
      showAlert({ title: 'Thông báo', message: 'Khung giờ này đã qua hoặc không khả dụng.' });
      return;
    }
    console.log("[BookAppointmentScreen] Khung giờ được chọn:", time);
    setSelectedTime(time);
  };

  const handleSimilarDoctorPress = (selectedDoctor: Doctor) => {
    if (!selectedDoctor) return;
    console.log(
      "[BookAppointmentScreen] Bác sĩ tương tự được chọn:",
      selectedDoctor.id
    );
    navigation.replace("BookAppointment", { doctor: selectedDoctor });
  };

  const handleFavoritePress = (doctorId: string) => {
    if (!doctorId) return;
    console.log(
      "[BookAppointmentScreen] Chuyển đổi yêu thích cho doctorId:",
      doctorId
    );
    setFavorites((prev) =>
      prev.includes(doctorId)
        ? prev.filter((id) => id !== doctorId)
        : [...prev, doctorId]
    );
  };

  const handleContinue = async () => {
    if (!selectedDate || !selectedTime) {
      showAlert({ title: 'Thông báo', message: 'Vui lòng chọn ngày và giờ khám.' });
      return;
    }

    if (!doctor || selectedScheduleIds.length === 0 || !patient?.patientId) {
      showAlert({ title: 'Lỗi', message: 'Thông tin bác sĩ, lịch hoặc bệnh nhân không hợp lệ.' });
      return;
    }

    try {
      const [slotStart, slotEnd] = selectedTime
        .split(" - ")
        .map((t) => `${t}:00`);
      const response = await API.get<ScheduleDto[]>(`/doctors/1/schedules`);
      const schedule = response.data.find(
        (s) =>
          selectedScheduleIds.includes(s.scheduleId) &&
          s.availableTimeSlots.some(
            (slot) => slot.slotStart === slotStart && slot.slotEnd === slotEnd
          )
      );

      if (!schedule) {
        throw new Error("Không tìm thấy lịch phù hợp với khung giờ được chọn");
      }

      // Additional check for past time slot before navigation
      const slot = timeSlots.find((s) => s.time === selectedTime);
      if (slot?.isPast) {
        showAlert({ title: 'Lỗi', message: 'Không thể chọn khung giờ đã qua.' });
        return;
      }

      navigation.navigate("SymptomSelection", {
        doctor,
        selectedDate,
        selectedTime,
        hasInsurance,
        scheduleId: schedule.scheduleId,
        patientId: patient.patientId,
      });
    } catch (error: any) {
      console.error(
        "[BookAppointmentScreen] Lỗi khi kiểm tra lịch:",
        error.message,
        error.response?.data
      );
      showAlert({ title: 'Lỗi', message: error.response?.data?.error || 'Không thể xác thực lịch. Vui lòng thử lại.', buttons: [{ text: "OK" }] });
    }
  };

  // Filter time slots by day part
  const morningSlots = timeSlots.filter((slot) => {
    const startHour = parseInt(slot.time.split(":")[0]);
    return startHour < 12;
  });

  const afternoonSlots = timeSlots.filter((slot) => {
    const startHour = parseInt(slot.time.split(":")[0]);
    return startHour >= 12;
  });

  const renderDateItem = ({ item }: { item: DateOption }) => {
    if (!item) return null;
    return (
      <DateCard
        date={item}
        isSelected={selectedDate === item.id}
        onPress={() => handleDateSelect(item)}
        showAvailability={true}
        availableSlots={item.availableSlots}
      />
    );
  };

  const renderTimeSlot = (slot: TimeSlotData) => {
    if (!slot) return null;
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
    );
  };

  const renderSimilarDoctor = ({ item }: { item: Doctor }) => {
    if (!item) return null;
    return (
      <SimilarDoctorCard
        doctor={item}
        onPress={() => handleSimilarDoctorPress(item)}
        showRating={true}
      />
    );
  };

  if (!fontsLoaded || !doctor) {
    console.log(
      "[BookAppointmentScreen] fontsLoaded:",
      fontsLoaded,
      "doctor:",
      doctor
    );
    return (
      <SafeAreaView style={globalStyles.container}>
        <Header
          title="Chọn thời gian khám"
          showBack={true}
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          {!fontsLoaded ? (
            <Text
              style={[styles.loadingText, { fontFamily: fontFamily.regular }]}
            >
              Đang tải font...
            </Text>
          ) : (
            <Text
              style={[styles.loadingText, { fontFamily: fontFamily.regular }]}
            >
              Lỗi: Không tìm thấy thông tin bác sĩ. Vui lòng thử lại.
            </Text>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <Header
        title="Chọn thời gian khám"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        style={globalStyles.container}
        contentContainerStyle={styles.contentContainer}
      >
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
            <Text
              style={[styles.selectionTitle, { fontFamily: fontFamily.bold }]}
            >
              Chọn ngày khám
            </Text>
          </View>

          {isLoadingDates ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text
                style={[styles.loadingText, { fontFamily: fontFamily.regular }]}
              >
                Đang tải lịch làm việc...
              </Text>
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
                <Ionicons
                  name="calendar-outline"
                  size={48}
                  color={colors.gray400}
                />
              </View>
              <Text
                style={[styles.noDataText, { fontFamily: fontFamily.semibold }]}
              >
                Không có lịch làm việc
              </Text>
              <Text
                style={[styles.noDataSubtext, { fontFamily: fontFamily.regular }]}
              >
                Vui lòng chọn bác sĩ khác hoặc thử lại sau
              </Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => fetchDates()}
              >
                <Text
                  style={[styles.retryButtonText, { fontFamily: fontFamily.medium }]}
                >
                  Thử lại
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Time Slot Selection */}
        {dates.length > 0 && (
          <View style={styles.timeSelectionContainer}>
            <View style={styles.sectionHeader}>
              <Ionicons name="time" size={20} color={colors.primary} />
              <Text
                style={[styles.selectionTitle, { fontFamily: fontFamily.bold }]}
              >
                Chọn giờ khám
              </Text>
            </View>

            {/* Day Part Tabs */}
            <View style={styles.dayPartContainer}>
              <View style={styles.dayPartTabs}>
                <TouchableOpacity
                  style={[
                    styles.dayPartTab,
                    selectedDayPart === "morning" && styles.dayPartTabSelected,
                  ]}
                  onPress={() => setSelectedDayPart("morning")}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.dayPartIcon,
                      selectedDayPart === "morning" &&
                        styles.dayPartIconSelected,
                    ]}
                  >
                    <Sun width={18} height={18} />
                  </View>
                  <Text
                    style={[
                      styles.dayPartText,
                      { fontFamily: fontFamily.medium },
                      selectedDayPart === "morning" &&
                        styles.dayPartTextSelected,
                    ]}
                  >
                    Buổi sáng
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.dayPartTab,
                    selectedDayPart === "afternoon" &&
                      styles.dayPartTabSelected,
                  ]}
                  onPress={() => setSelectedDayPart("afternoon")}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.dayPartIcon,
                      selectedDayPart === "afternoon" &&
                        styles.dayPartIconSelected,
                    ]}
                  >
                    <Moon width={18} height={18} />
                  </View>
                  <Text
                    style={[
                      styles.dayPartText,
                      { fontFamily: fontFamily.medium },
                      selectedDayPart === "afternoon" &&
                        styles.dayPartTextSelected,
                    ]}
                  >
                    Buổi chiều
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Time Slots Grid */}
            {isLoadingSlots ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text
                  style={[styles.loadingText, { fontFamily: fontFamily.regular }]}
                >
                  Đang tải khung giờ...
                </Text>
              </View>
            ) : selectedScheduleIds.length === 0 ? (
              <View style={styles.noSlotsContainer}>
                <View style={styles.emptyStateIcon}>
                  <Ionicons
                    name="time-outline"
                    size={40}
                    color={colors.gray400}
                  />
                </View>
                <Text
                  style={[styles.noDataText, { fontFamily: fontFamily.medium }]}
                >
                  Không có khung giờ khả dụng
                </Text>
                <Text
                  style={[styles.noDataSubtext, { fontFamily: fontFamily.regular }]}
                >
                  Vui lòng chọn ngày khác hoặc bác sĩ khác
                </Text>
              </View>
            ) : (selectedDayPart === "morning" ? morningSlots : afternoonSlots)
                .length > 0 ? (
              <View style={styles.timeSlotWrapper}>
                <View style={styles.timeSlotGrid}>
                  {(selectedDayPart === "morning"
                    ? morningSlots
                    : afternoonSlots
                  ).map((slot) => renderTimeSlot(slot))}
                </View>
              </View>
            ) : (
              <View style={styles.noSlotsContainer}>
                <View style={styles.emptyStateIcon}>
                  <Ionicons
                    name="time-outline"
                    size={40}
                    color={colors.gray400}
                  />
                </View>
                <Text
                  style={[styles.noDataText, { fontFamily: fontFamily.medium }]}
                >
                  Không có khung giờ{" "}
                  {selectedDayPart === "morning" ? "buổi sáng" : "buổi chiều"}
                </Text>
                <Text
                  style={[styles.noDataSubtext, { fontFamily: fontFamily.regular }]}
                >
                  Thử chọn{" "}
                  {selectedDayPart === "morning" ? "buổi chiều" : "buổi sáng"}{" "}
                  hoặc ngày khác
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Insurance Section */}
        <View style={styles.insuranceContainer}>
          <View style={styles.insuranceCard}>
            <TouchableOpacity
              style={styles.insuranceOption}
              onPress={() => setHasInsurance(!hasInsurance)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.checkbox,
                  hasInsurance && styles.checkboxSelected,
                ]}
              >
                {hasInsurance && (
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color={colors.white}
                  />
                )}
              </View>
              <Text
                style={[
                  styles.insuranceText,
                  { fontFamily: fontFamily.semibold },
                  hasInsurance && styles.insuranceTextSelected,
                ]}
              >
                Sử dụng bảo hiểm y tế
              </Text>
            </TouchableOpacity>

            {hasInsurance && (
              <View style={styles.insuranceNote}>
                <Ionicons
                  name="information-circle"
                  size={18}
                  color={"#ff0000"}
                />
                <Text
                  style={[
                    styles.insuranceNoteText,
                    { fontFamily: fontFamily.regular },
                  ]}
                >
                  Vui lòng mang theo thẻ bảo hiểm y tế khi đến khám để được hưởng quyền lợi.
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Similar Doctors */}
        {similarDoctors.length > 0 && (
          <View style={styles.similarDoctorsContainer}>
            <Text
              style={[styles.similarDoctorsTitle, { fontFamily: fontFamily.bold }]}
            >
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
            style={[
              styles.continueButton,
              (!selectedDate || !selectedTime) && styles.buttonDisabled,
            ]}
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
  );
};

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
    marginBottom: 16,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    elevation: 4,
  },
  insuranceCard: {
    marginTop: 12,
  },
  insuranceOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.gray300,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  insuranceText: {
    fontSize: 15,
    color: colors.text,
  },
  insuranceTextSelected: {
    color: colors.primary,
    fontWeight: "600",
  },
  insuranceNote: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.blue50,
    padding: 16,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#ff0000",
    marginTop: 12,
  },
  insuranceNoteText: {
    fontSize: 13,
    color: "#ff0000",
    marginLeft: 12,
    flex: 1,
    lineHeight: 18,
  },
  similarDoctorsContainer: {
    marginBottom: 16,
    paddingRight: 20,
    paddingLeft: 20,
    paddingBottom: 20,
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
});