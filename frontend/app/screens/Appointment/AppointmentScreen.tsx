"use client";

import { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  View,
  Text,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFont, fontFamily } from "../../context/FontContext";
import { useNavigation } from "@react-navigation/native";
import SegmentedControl from "../../components/Appointment/SegmentedControl";
import SearchBar from "../../components/Appointment/SearchBar";
import AppointmentCard from "../../components/Appointment/AppointmentCard";
import DateFilterModal from "../../components/Appointment/DateFilterModal";
import Header from "../../components/Header";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import type { Appointment, AppointmentResponseDto } from "./type";

const AppointmentsScreen = () => {
  const navigation = useNavigation();
  const { loggedIn, patient } = useAuth();
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed">(
    "upcoming"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const { fontsLoaded } = useFont();

  useEffect(() => {
    if (loggedIn && patient?.patientId) {
      fetchAppointments();
    } else {
      setIsLoading(false);
      setFilteredAppointments([]);
      Alert.alert("Thông báo", "Vui lòng đăng nhập để xem lịch khám.", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    }
  }, [activeTab, startDate, endDate, loggedIn, patient]);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const patientId = patient?.patientId;
      if (!patientId) {
        throw new Error("Patient ID not available");
      }

      console.log(
        "[AppointmentsScreen] Fetching appointments for patientId:",
        patientId
      );
      const response = await API.get<AppointmentResponseDto[]>(
        `/appointments/patient/${patientId}`,
        {
          params: {
            ...(startDate &&
              endDate && {
                startDate: startDate.toISOString().split("T")[0],
                endDate: endDate.toISOString().split("T")[0],
              }),
          },
        }
      );
      console.log(
        "[AppointmentsScreen] API response:",
        JSON.stringify(response.data, null, 2)
      );

      const statusFilter =
        activeTab === "upcoming" ? ["PENDING", "CONFIRMED"] : ["COMPLETED"];
      const filteredData = response.data.filter((dto) =>
        statusFilter.includes(dto.appointmentStatus)
      );

      const appointments: Appointment[] = await Promise.all(
        filteredData.map(async (dto) => {
          let doctorInfo = dto.doctorInfo;
          if (!doctorInfo) {
            try {
              const doctorResponse = await API.get(`/doctors/${dto.doctorId}`);
              doctorInfo = doctorResponse.data;
            } catch (error) {
              console.warn(
                `[AppointmentsScreen] Error fetching doctor ${dto.doctorId}:`,
                error
              );
            }
          }

          let schedule = dto.schedule;
          if (!schedule && dto.schedule?.scheduleId) {
            try {
              const scheduleResponse = await API.get(
                `/doctors/schedules/${dto.schedule.scheduleId}`
              );
              schedule = scheduleResponse.data;
            } catch (error) {
              console.warn(
                `[AppointmentsScreen] Error fetching schedule ${dto.schedule.scheduleId} for appointment ${dto.appointmentId}:`,
                error
              );
            }
          } else if (!schedule) {
            console.warn(
              `[AppointmentsScreen] No schedule found for appointment ${dto.appointmentId}`
            );
          }

          let roomInfo = null;
          if (schedule?.roomId) {
            try {
              const roomResponse = await API.get(
                `/examination-rooms/${schedule.roomId}`
              );
              roomInfo = roomResponse.data;
            } catch (error) {
              console.warn(
                `[AppointmentsScreen] Error fetching room ${schedule.roomId}:`,
                error
              );
            }
          }

          const workDate = new Date(dto.createdAt).toLocaleDateString("vi-VN", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });

          return {
            id: dto.appointmentId.toString(),
            date: workDate,
            time: `${dto.slotStart.slice(0, 5)} - ${dto.slotEnd.slice(0, 5)}`,
            doctorName: `${doctorInfo?.academicDegree || ""} ${
              doctorInfo?.fullName || "Bác sĩ chưa có tên"
            }`.trim(),
            specialty: doctorInfo?.specialization || "Chưa xác định",
            imageUrl: "https://via.placeholder.com/60",
            status: activeTab,
            department: doctorInfo?.specialization,
            room: roomInfo
              ? `${roomInfo.note || "Phòng chưa xác định"} - Tầng ${
                  roomInfo.floor || "X"
                } ${roomInfo.building || ""}`
              : "Phòng chưa xác định",
            queueNumber: dto.number,
            patientName: dto.patientInfo?.fullName || "Bệnh nhân chưa cung cấp",
            patientBirthday: dto.patientInfo?.birthday || "Không xác định",
            patientGender: dto.patientInfo?.gender || "Không xác định",
            patientLocation: dto.patientInfo?.address || "Không xác định",
            appointmentFee: "150.000 VND",
            ...(activeTab === "completed" && {
              examTime: `${dto.slotStart.slice(0, 5)} - ${dto.slotEnd.slice(
                0,
                5
              )}`,
              followUpDate: new Date(
                new Date(dto.createdAt).getTime() + 14 * 24 * 60 * 60 * 1000
              ).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }),
              diagnosis: dto.appointmentNotes
                ? dto.appointmentNotes
                    .filter((note) => note.noteType === "DIAGNOSIS")
                    .map((note) => note.content || "Chưa có chẩn đoán")
                : [],
              doctorNotes: dto.appointmentNotes
                ? dto.appointmentNotes
                    .filter((note) => note.noteType === "NOTE")
                    .map((note) => note.content || "Chưa có ghi chú")
                : [],
              testResults: dto.appointmentNotes
                ? dto.appointmentNotes
                    .filter((note) => note.noteType === "TEST_RESULT")
                    .map((note, index) => ({
                      name: `Kết quả xét nghiệm ${index + 1}`,
                      fileUrl: note.content || "/placeholder.pdf",
                    }))
                : [],
            }),
          };
        })
      );

      console.log(
        "[AppointmentsScreen] Mapped appointments:",
        JSON.stringify(appointments, null, 2)
      );
      filterAppointments(appointments);
    } catch (error: any) {
      console.error(
        "[AppointmentsScreen] Error fetching appointments:",
        error.message,
        error.response?.data
      );
      Alert.alert(
        "Lỗi",
        "Không thể tải danh sách lịch khám. Vui lòng thử lại.",
        [{ text: "OK" }]
      );
      setFilteredAppointments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAppointments = (appointments: Appointment[]) => {
    const filtered = appointments.filter((appointment) => {
      const matchesSearch =
        searchQuery === "" ||
        appointment.doctorName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        appointment.specialty.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });

    setFilteredAppointments(filtered);
    console.log(
      "[AppointmentsScreen] Filtered appointments:",
      JSON.stringify(filtered, null, 2)
    );
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleFilter = () => {
    setShowFilterModal(true);
  };

  const handleApplyFilter = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const renderDateFilterInfo = () => {
    if (!startDate || !endDate) return null;

    const formatDate = (date: Date) => {
      return `${date.getDate().toString().padStart(2, "0")}/${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;
    };

    return (
      <View style={styles.filterInfoContainer}>
        <Text style={styles.filterInfoText}>
          Lọc từ {formatDate(startDate)} đến {formatDate(endDate)}
        </Text>
      </View>
    );
  };

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Đang tải font...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Lịch khám"
        showBack={false}
        showAction={true}
        actionType="notification"
        onActionPress={() => navigation.navigate("Notifications")}
      />
      <View style={[styles.header, { paddingTop: insets.top === 0 ? 12 : 0 }]}>
        <SegmentedControl
          options={[
            { label: "Sắp đến", value: "upcoming" },
            { label: "Đã khám", value: "completed" },
          ]}
          style={styles.segmentedControl}
          selectedStyle={styles.selectedOption}
          selectedValue={activeTab}
          onChange={(value) => setActiveTab(value as "upcoming" | "completed")}
        />

        <SearchBar
          placeholder="Tìm bác sĩ tim mạch"
          value={searchQuery}
          onSearch={handleSearch}
          onFilter={handleFilter}
        />

        {renderDateFilterInfo()}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0BC5C5" />
          <Text style={styles.loadingText}>Đang tải lịch khám...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Không tìm thấy lịch khám nào.
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      <DateFilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleApplyFilter}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: "#F3F4F6",
  },
  segmentedControl: {
    marginBottom: 16,
  },
  selectedOption: {
    backgroundColor: "#0BC5C5",
    color: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingRight: 16,
    paddingLeft: 16,
    paddingBottom: 16,
  },
  filterInfoContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#E6F7F7",
    borderRadius: 8,
    marginBottom: 8,
  },
  filterInfoText: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: "#0BC5C5",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  emptyText: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: "#6B7280",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  loadingText: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: "#6B7280",
    marginTop: 10,
  },
});

export default AppointmentsScreen;
