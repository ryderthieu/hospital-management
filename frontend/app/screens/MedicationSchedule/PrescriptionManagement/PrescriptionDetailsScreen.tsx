"use client";

import React, { useState, useEffect, FC } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  Alert,
  Modal,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { fontFamily } from "../../../context/FontContext";
import Header from "../../../components/Header";
import { colors } from "../../../styles/globalStyles";
import type { PrescriptionDetail, MedicationDetail } from "../type";
import API from "../../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from 'expo-notifications';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from "@react-native-community/datetimepicker";

// Cấu hình thông báo
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Định nghĩa kiểu dữ liệu từ backend
interface BackendPrescriptionDetail {
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
}

// Hàm ánh xạ chi tiết đơn thuốc
const mapBackendToFrontendMedication = (
  backendDetails: BackendPrescriptionDetail[]
): MedicationDetail[] => {
  return backendDetails.map((detail) => ({
    id: detail.detailId.toString(),
    name: detail.medicine.medicineName,
    route: "Uống", // Giả định, có thể cần thêm trường trong backend
    timesPerDay: parseInt(detail.frequency) || 1,
    quantityPerDay: detail.quantity,
    timeOfUse: detail.frequency,
    isScheduled: false,
    hasReminder: false,
  }));
};

const PrescriptionDetailsScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { prescriptionId } = route.params as { prescriptionId: string };
  const [prescriptionDetail, setPrescriptionDetail] =
    useState<PrescriptionDetail | null>(null);
  const [activeTab, setActiveTab] = useState<"unscheduled" | "scheduled">(
    "scheduled"
  );
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedMedicationId, setSelectedMedicationId] = useState<
    string | null
  >(null);
  const [reminderTimes, setReminderTimes] = useState<{
    [key: string]: string[];
  }>({});

  const fetchPrescriptionDetails = async () => {
    try {
      const response = await API.get(
        `/pharmacy/prescriptions/detail/${prescriptionId}`
      );
      const backendDetails: BackendPrescriptionDetail[] = response.data;
      const medications = mapBackendToFrontendMedication(backendDetails);
      const storedReminders = await AsyncStorage.getItem(
        `reminders_${prescriptionId}`
      );
      const reminders = storedReminders ? JSON.parse(storedReminders) : {};
      setReminderTimes(reminders);
      setPrescriptionDetail({
        id: prescriptionId,
        specialty: "Unknown", // Cần API bác sĩ để lấy chuyên khoa
        code: `TM${prescriptionId.padStart(6, "0")}`,
        medications: medications.map((med) => ({
          ...med,
          isScheduled: !!reminders[med.id],
          hasReminder: !!reminders[med.id],
        })),
      });
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết đơn thuốc:", error);
    }
  };

  useEffect(() => {
    fetchPrescriptionDetails();
  }, [prescriptionId]);

  const scheduleNotification = async (medication: MedicationDetail, time: string) => {
    try {
      const [hours, minutes] = time.split(":").map(Number);
      const notificationId = `${medication.id}_${time}`;

      // Kiểm tra quyền thông báo
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus !== 'granted') {
          Alert.alert('Cần quyền thông báo', 'Vui lòng cấp quyền thông báo để nhận nhắc nhở uống thuốc.');
          return;
        }
      }

      // Hủy thông báo cũ nếu có
      await Notifications.cancelScheduledNotificationAsync(notificationId);

      // Tính toán thời gian trigger
      const now = new Date();
      const triggerDate = new Date();
      triggerDate.setHours(hours, minutes, 0, 0);

      // Nếu thời gian đã qua trong ngày hôm nay, đặt cho ngày mai
      if (triggerDate.getTime() <= now.getTime()) {
        triggerDate.setDate(triggerDate.getDate() + 1);
      }

      // Log thông tin để debug
      console.log('=== THÔNG TIN ĐẶT LỊCH ===');
      console.log('Thuốc:', medication.name);
      console.log('Thời gian hiện tại:', now.toLocaleTimeString('vi-VN'));
      console.log('Thời gian đặt lịch:', triggerDate.toLocaleTimeString('vi-VN'));
      console.log('Ngày đặt lịch:', triggerDate.toLocaleDateString('vi-VN'));
      console.log('ID thông báo:', notificationId);
      console.log('========================');

      // Tính toán thời gian chờ (ms)
      const delay = triggerDate.getTime() - now.getTime();

      // Đặt lịch thông báo với setTimeout
      setTimeout(async () => {
        try {
          await Notifications.scheduleNotificationAsync({
            identifier: notificationId,
            content: {
              title: '💊 Nhắc nhở uống thuốc',
              body: `Đã đến giờ uống ${medication.name}\n📋 Liều lượng: ${medication.timeOfUse}`,
              data: { medicationId: medication.id, time, name: medication.name, timeOfUse: medication.timeOfUse },
            },
            trigger: null,
          });
          console.log(`✅ Đã gửi thông báo cho ${medication.name} lúc ${time}`);
        } catch (error) {
          console.error('Lỗi khi gửi thông báo:', error);
        }
      }, delay);

      // Lưu thông tin về thời gian đặt lịch
      await AsyncStorage.setItem(
        `notification_${notificationId}`,
        JSON.stringify({
          medicationId: medication.id,
          time,
          nextTrigger: triggerDate.getTime(),
        })
      );

      console.log(`✅ Đã đặt lịch thành công cho ${medication.name} lúc ${time}`);

    } catch (error) {
      console.error('Lỗi khi đặt thông báo:', error);
      Alert.alert('Lỗi', 'Không thể đặt lịch thông báo. Vui lòng thử lại.');
    }
  };

  // Thêm listener cho thông báo khi app đang chạy
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Nhận thông báo:', notification);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleSetReminder = async (medicationId: string) => {
    setSelectedMedicationId(medicationId);
    setShowTimePicker(true);
  };

  const handleTimeChange = async (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === "android" ? false : showTimePicker);
    
    if (event.type === 'dismissed') {
      setSelectedMedicationId(null);
      return;
    }

    if (selectedTime && selectedMedicationId) {
      try {
        // Lấy giờ và phút từ thời gian được chọn
        const hours = selectedTime.getHours();
        const minutes = selectedTime.getMinutes();
        
        // Format thời gian theo định dạng HH:mm
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        // Kiểm tra xem thời gian này đã được đặt chưa
        const existingTimes = reminderTimes[selectedMedicationId] || [];
        if (existingTimes.includes(timeString)) {
          console.log('Thời gian này đã được đặt');
          return;
        }

        const newReminders = {
          ...reminderTimes,
          [selectedMedicationId]: [
            ...(reminderTimes[selectedMedicationId] || []),
            timeString,
          ].sort(), // Sắp xếp thời gian tăng dần
        };

        const medication = prescriptionDetail?.medications.find(
          (med) => med.id === selectedMedicationId
        );

        if (medication) {
          await scheduleNotification(medication, timeString);
          await AsyncStorage.setItem(
            `reminders_${prescriptionId}`,
            JSON.stringify(newReminders)
          );
          setReminderTimes(newReminders);
          setPrescriptionDetail((prev) => ({
            ...prev!,
            medications: prev!.medications.map((med) =>
              med.id === selectedMedicationId
                ? { ...med, isScheduled: true, hasReminder: true }
                : med
            ),
          }));
        }
      } catch (error) {
        console.error('Lỗi khi thiết lập thông báo:', error);
      }
    }
    setSelectedMedicationId(null);
  };

  // Cập nhật hàm removeReminder để sử dụng notifee
  const removeReminder = async (medicationId: string, time: string) => {
    try {
      const notificationId = `${medicationId}_${time}`;
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      
      const newReminders = {
        ...reminderTimes,
        [medicationId]: (reminderTimes[medicationId] || []).filter(t => t !== time)
      };

      if (newReminders[medicationId].length === 0) {
        delete newReminders[medicationId];
      }

      await AsyncStorage.setItem(
        `reminders_${prescriptionId}`,
        JSON.stringify(newReminders)
      );
      
      setReminderTimes(newReminders);
      setPrescriptionDetail((prev) => ({
        ...prev!,
        medications: prev!.medications.map((med) =>
          med.id === medicationId
            ? { 
                ...med, 
                isScheduled: Boolean(newReminders[medicationId]?.length),
                hasReminder: Boolean(newReminders[medicationId]?.length)
              }
            : med
        ),
      }));

      console.log(`✅ Đã xóa thông báo cho thuốc ID ${medicationId} lúc ${time}`);
    } catch (error) {
      console.error('❌ Lỗi khi xóa thông báo:', error);
      throw error;
    }
  };

  const unscheduledMedications =
    prescriptionDetail?.medications.filter((med) => !med.isScheduled) || [];
  const scheduledMedications =
    prescriptionDetail?.medications.filter((med) => med.isScheduled) || [];

  const renderMedicationItem = (medication: MedicationDetail) => (
    <View key={medication.id} style={styles.medicationContainer}>
      <View style={styles.medicationHeader}>
        <View style={styles.medicationIcon}>
          <View style={styles.pillIcon}>
            <View style={styles.pillLeft} />
            <View style={styles.pillRight} />
          </View>
        </View>
        <Text
          style={[styles.medicationName, { fontFamily: fontFamily.medium }]}
        >
          {medication.name}
        </Text>
      </View>
      <View style={styles.medicationDetails}>
        <View style={styles.detailRow}>
          <Text
            style={[styles.detailLabel, { fontFamily: fontFamily.regular }]}
          >
            Đường dùng:
          </Text>
          <Text style={[styles.detailValue, { fontFamily: fontFamily.medium }]}>
            {medication.route}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text
            style={[styles.detailLabel, { fontFamily: fontFamily.regular }]}
          >
            Lần/ngày:
          </Text>
          <Text style={[styles.detailValue, { fontFamily: fontFamily.medium }]}>
            {medication.timesPerDay}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text
            style={[styles.detailLabel, { fontFamily: fontFamily.regular }]}
          >
            Số lượng/ngày:
          </Text>
          <Text style={[styles.detailValue, { fontFamily: fontFamily.medium }]}>
            {medication.quantityPerDay}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text
            style={[styles.detailLabel, { fontFamily: fontFamily.regular }]}
          >
            Buổi dùng:
          </Text>
          <Text style={[styles.detailValue, { fontFamily: fontFamily.medium }]}>
            {medication.timeOfUse}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.reminderButton}
        onPress={() => handleSetReminder(medication.id)}
      >
        <View style={styles.bellIcon}>
          {medication.hasReminder ? (
            <>
              <View style={styles.bellBody} />
              <View style={styles.bellHandle} />
              <View style={styles.bellClapper} />
            </>
          ) : (
            <>
              <View style={styles.bellBody} />
              <View style={styles.bellHandle} />
              <View style={styles.bellSlash} />
            </>
          )}
        </View>
        <Text
          style={[styles.reminderButtonText, { fontFamily: fontFamily.medium }]}
        >
          {medication.hasReminder
            ? `Đã đặt lịch nhắc: ${
                reminderTimes[medication.id]?.join(", ") || ""
              }`
            : "Đặt lịch nhắc"}
        </Text>
      </TouchableOpacity>
      {activeTab === "scheduled" &&
        scheduledMedications.length > 0 &&
        medication.id !==
          scheduledMedications[scheduledMedications.length - 1].id && (
          <View style={styles.dottedDivider} />
        )}
      {activeTab === "unscheduled" &&
        unscheduledMedications.length > 0 &&
        medication.id !==
          unscheduledMedications[unscheduledMedications.length - 1].id && (
          <View style={styles.dottedDivider} />
        )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Text style={[styles.emptyStateText, { fontFamily: fontFamily.medium }]}>
        Tất cả thuốc trong toa đã được đặt lịch thành công
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header
        title="Chi tiết đơn thuốc"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.content}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "unscheduled" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("unscheduled")}
          >
            <Text
              style={[
                styles.tabText,
                { fontFamily: fontFamily.medium },
                activeTab === "unscheduled" && styles.activeTabText,
              ]}
            >
              Chưa đặt lịch ({unscheduledMedications.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "scheduled" && styles.activeTab]}
            onPress={() => setActiveTab("scheduled")}
          >
            <Text
              style={[
                styles.tabText,
                { fontFamily: fontFamily.medium },
                activeTab === "scheduled" && styles.activeTabText,
              ]}
            >
              Đã đặt lịch ({scheduledMedications.length})
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.prescriptionCard}>
          {prescriptionDetail ? (
            <>
              <View style={styles.prescriptionInfo}>
                <View style={styles.infoRow}>
                  <Text
                    style={[
                      styles.infoLabel,
                      { fontFamily: fontFamily.regular },
                    ]}
                  >
                    Đơn thuốc:
                  </Text>
                  <Text
                    style={[
                      styles.infoValue,
                      { fontFamily: fontFamily.medium },
                    ]}
                  >
                    {prescriptionDetail.specialty}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text
                    style={[
                      styles.infoLabel,
                      { fontFamily: fontFamily.regular },
                    ]}
                  >
                    Mã đơn thuốc:
                  </Text>
                  <Text
                    style={[
                      styles.infoValue,
                      { fontFamily: fontFamily.medium },
                    ]}
                  >
                    {prescriptionDetail.code}
                  </Text>
                </View>
              </View>
              <View style={styles.divider} />
              {activeTab === "unscheduled" &&
              unscheduledMedications.length === 0 ? (
                renderEmptyState()
              ) : (
                <ScrollView
                  style={styles.medicationsList}
                  showsVerticalScrollIndicator={false}
                >
                  {activeTab === "unscheduled"
                    ? unscheduledMedications.map(renderMedicationItem)
                    : scheduledMedications.map(renderMedicationItem)}
                </ScrollView>
              )}
            </>
          ) : (
            <Text
              style={[styles.loadingText, { fontFamily: fontFamily.regular }]}
            >
              Đang tải...
            </Text>
          )}
        </View>
      </View>
      {showTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleTimeChange}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#E5E5E5",
    borderRadius: 25,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    color: "#666",
  },
  activeTabText: {
    color: "#333",
  },
  prescriptionCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  prescriptionInfo: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    width: 120,
  },
  infoValue: {
    fontSize: 14,
    color: colors.base500,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginBottom: 16,
  },
  medicationsList: {
    flex: 1,
  },
  medicationContainer: {
    marginBottom: 12,
  },
  medicationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  medicationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  pillIcon: {
    flexDirection: "row",
    width: 20,
    height: 12,
  },
  pillLeft: {
    width: 10,
    height: 12,
    backgroundColor: colors.base500,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  pillRight: {
    width: 10,
    height: 12,
    backgroundColor: "#81C784",
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  medicationName: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  medicationDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    width: 120,
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  reminderButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E6F7F7",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  bellIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
    position: "relative",
  },
  bellBody: {
    position: "absolute",
    bottom: 2,
    left: 2,
    right: 2,
    height: 12,
    backgroundColor: colors.base500,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  bellHandle: {
    position: "absolute",
    top: 0,
    left: 6,
    right: 6,
    height: 4,
    backgroundColor: colors.base500,
    borderRadius: 2,
  },
  bellClapper: {
    position: "absolute",
    bottom: 0,
    left: 7,
    width: 2,
    height: 2,
    backgroundColor: colors.base500,
    borderRadius: 1,
  },
  bellSlash: {
    position: "absolute",
    top: 6,
    left: -2,
    width: 20,
    height: 2,
    backgroundColor: "#FF5252",
    borderRadius: 1,
    transform: [{ rotate: "45deg" }],
    zIndex: 1,
  },
  reminderButtonText: {
    fontSize: 14,
    color: colors.base500,
  },
  dottedDivider: {
    height: 1,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginVertical: 8,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#4CAF50",
    textAlign: "center",
    lineHeight: 24,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default PrescriptionDetailsScreen;
