"use client"

import type React from "react"
import { useState } from "react"
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { fontFamily } from "../../context/FontContext"
import Header from "../../components/Header"
import { DateCard } from "../BookAppointment/DoctorBookAppointmentScreen/DateCard"
import Checkbox from "../../components/MedicationSchedule/Checkbox"
import MedicationConfirmModal from "../../components/MedicationSchedule/MedicationConfirmModal"
import type { DateOption, TimeSlot, Medication } from "./type"
import { colors } from "../../styles/globalStyles"

// Sample data - you can replace this with your actual data fetching logic
const dateOptions: DateOption[] = [
  { id: 1, day: "CN", date: 16, disabled: false },
  { id: 2, day: "Th 2", date: 17, disabled: false },
  { id: 3, day: "Th 3", date: 18, disabled: false },
  { id: 4, day: "Th 4", date: 19, disabled: false },
  { id: 5, day: "Th 5", date: 20, disabled: true },
]

const initialTimeSlots: TimeSlot[] = [
  {
    id: "1",
    period: "Buổi sáng",
    icon: "morning",
    medications: [
      {
        id: "1",
        name: "Ambroxol HCl (Medovent 30mg)",
        dosage: "Dùng 1 viên",
        time: "07:30",
        instructions: "",
        status: "taken",
      },
    ],
  },
  {
    id: "2",
    period: "Buổi trưa",
    icon: "noon",
    medications: [
      {
        id: "2",
        name: "Ambroxol HCl (Medovent 30mg)",
        dosage: "Dùng 1 viên",
        time: "07:30",
        instructions: "",
        status: "canceled",
      },
    ],
  },
  {
    id: "3",
    period: "Buổi tối",
    icon: "evening",
    medications: [
      {
        id: "3",
        name: "Ambroxol HCl (Medovent 30mg)",
        dosage: "Dùng 1 viên",
        time: "07:30",
        instructions: "",
        status: "pending",
      },
    ],
  },
]

interface MedicationScheduleScreenProps {
  // You can add props here to customize the component
  onManagePrescriptions?: () => void
  // If you want to pass custom data instead of using the sample data
  customDateOptions?: DateOption[]
  customTimeSlots?: TimeSlot[]
  // Navigation props or other app-specific props can be added here
}

const MedicationScheduleScreen: React.FC<MedicationScheduleScreenProps> = ({
  onManagePrescriptions,
  customDateOptions,
  customTimeSlots,
}) => {
  const [selectedDateId, setSelectedDateId] = useState(1)
  const [medications, setMedications] = useState<TimeSlot[]>(customTimeSlots || initialTimeSlots)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedMedication, setSelectedMedication] = useState<{
    medication: Medication
    timeSlotId: string
  } | null>(null)

  const dates = customDateOptions || dateOptions
  const navigation = useNavigation()

  const handleMedicationPress = (timeSlotId: string, medication: Medication) => {
    // Open the confirmation modal
    setSelectedMedication({ medication, timeSlotId })
    setModalVisible(true)
  }

  const handleConfirmMedication = () => {
    if (!selectedMedication) return

    // Update the medication status
    setMedications((prevSlots) =>
      prevSlots.map((slot) => {
        if (slot.id === selectedMedication.timeSlotId) {
          return {
            ...slot,
            medications: slot.medications.map((med) => {
              if (med.id === selectedMedication.medication.id) {
                return { ...med, status: "taken" }
              }
              return med
            }),
          }
        }
        return slot
      }),
    )

    // Close the modal
    setModalVisible(false)
    setSelectedMedication(null)
  }

  const handleCancelMedication = () => {
    if (!selectedMedication) return

    // Update the medication status to canceled
    setMedications((prevSlots) =>
      prevSlots.map((slot) => {
        if (slot.id === selectedMedication.timeSlotId) {
          return {
            ...slot,
            medications: slot.medications.map((med) => {
              if (med.id === selectedMedication.medication.id) {
                return { ...med, status: "canceled" }
              }
              return med
            }),
          }
        }
        return slot
      }),
    )

    // Close the modal
    setModalVisible(false)
    setSelectedMedication(null)
  }

  const handleAdjustMedication = () => {
    // Here you would implement the logic to adjust the medication
    // For now, we'll just close the modal
    setModalVisible(false)
    setSelectedMedication(null)
  }

  const handleCloseModal = () => {
    setModalVisible(false)
    setSelectedMedication(null)
  }

  const renderIcon = (icon: "morning" | "noon" | "evening") => {
    // You can replace these with your actual icons
    switch (icon) {
      case "morning":
        return (
          <View style={styles.iconContainer}>
            <Image source={require("../../assets/images/ThoiGian/sun.png")} style={styles.weatherIcon} />
          </View>
        )
      case "noon":
        return (
          <View style={styles.iconContainer}>
            <Image source={require("../../assets/images/ThoiGian/Afternoon.png")} style={styles.weatherIcon} />
          </View>
        )
      case "evening":
        return (
          <View style={styles.iconContainer}>
            <Image source={require("../../assets/images/ThoiGian/moon.png")} style={styles.weatherIcon} />
          </View>
        )
      default:
        return null
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Header
        title="Hồ sơ"
        showBack={false}
        showAction={true}
        actionType="notification"
        onActionPress={() => navigation.navigate("Notifications")}
      />

      {/* Date Selector using DateCard component */}
      <View style={styles.dateSelector}>
        <FlatList
          data={dates}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateList}
          renderItem={({ item }) => (
            <DateCard date={item} isSelected={item.id === selectedDateId} onPress={() => setSelectedDateId(item.id)} />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>

      {/* Medication Schedule Title */}
      <Text style={[styles.scheduleTitle, { fontFamily: fontFamily.medium }]}>Lịch uống thuốc hôm nay</Text>

      {/* Medication List - Single Container */}
      <ScrollView style={styles.medicationList}>
        <View style={styles.medicationContainer}>
          {medications.map((timeSlot, index) => (
            <View key={timeSlot.id}>
              <View style={styles.timeSlotSection}>
                <View style={styles.timeSlotHeader}>
                  {renderIcon(timeSlot.icon)}
                  <Text style={[styles.timeSlotTitle, { fontFamily: fontFamily.medium }]}>{timeSlot.period}</Text>
                </View>

                {timeSlot.medications.map((medication) => (
                  <TouchableOpacity
                    key={medication.id}
                    style={styles.medicationItem}
                    onPress={() => handleMedicationPress(timeSlot.id, medication)}
                    activeOpacity={0.7}
                  >
                    <Checkbox status={medication.status || "pending"} />
                    <View style={styles.medicationDetails}>
                      <Text
                        style={[
                          styles.medicationName,
                          { fontFamily: fontFamily.regular },
                          medication.status === "taken" && styles.takenMedicationText,
                          medication.status === "canceled" && styles.canceledMedicationText,
                        ]}
                      >
                        {medication.name}
                      </Text>
                      <Text
                        style={[
                          styles.medicationTime,
                          { fontFamily: fontFamily.regular },
                          medication.status === "taken" && styles.takenMedicationTimeText,
                          medication.status === "canceled" && styles.canceledMedicationTimeText,
                        ]}
                      >
                        <Text style={[styles.timeHighlight, { fontFamily: fontFamily.medium }]}>{medication.time}</Text>{" "}
                        - {medication.dosage}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Dotted Divider - only show between time slots, not after the last one */}
              {index < medications.length - 1 && <View style={styles.dottedDivider} />}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Manage Prescriptions Button */}
      <TouchableOpacity style={styles.manageButton} onPress={() => navigation.navigate("PrescriptionManagement")}>
        <Text style={[styles.manageButtonText, { fontFamily: fontFamily.medium }]}>Quản lý đơn thuốc</Text>
      </TouchableOpacity>

      {/* Medication Confirmation Modal */}
      <MedicationConfirmModal
        visible={modalVisible}
        medication={selectedMedication?.medication || null}
        onClose={handleCloseModal}
        onConfirm={handleConfirmMedication}
        onCancel={handleCancelMedication}
        onAdjust={handleAdjustMedication}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  dateSelector: {
    paddingVertical: 16,
    backgroundColor: "#fff",
  },
  dateList: {
    paddingHorizontal: 16,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 16,
    marginTop: 20,
    paddingBottom: 8,
    marginBottom: 12,
    color: "#333",
  },
  medicationList: {
    padding: 2,
    flex: 1,
    paddingHorizontal: 16,
  },
  medicationContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  timeSlotSection: {
    paddingVertical: 8,
  },
  timeSlotHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    marginRight: 12,
  },
  weatherIcon: {
    width: 28,
    height: 28,
  },
  timeSlotTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  medicationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  medicationDetails: {
    marginLeft: 16,
    flex: 1,
  },
  medicationName: {
    fontSize: 15,
    color: "#333",
    marginBottom: 6,
    fontWeight: "500",
  },
  medicationTime: {
    fontSize: 13,
    color: "#666",
  },
  timeHighlight: {
    fontWeight: "600",
    color: colors.base500,
  },
  takenMedicationText: {
    color: colors.base500,
  },
  takenMedicationTimeText: {
    color: colors.base500,
  },
  canceledMedicationText: {
    color: "#FF5252",
  },
  canceledMedicationTimeText: {
    color: "#FF5252",
  },
  dottedDivider: {
    height: 1,
    marginVertical: 20,
    marginHorizontal: 8,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  manageButton: {
    backgroundColor: colors.base500,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    margin: 16,
    shadowColor: colors.base500,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  manageButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default MedicationScheduleScreen
