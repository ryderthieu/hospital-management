"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
import { DateCard } from "../../components/MedicationSchedule/DateCard"
import Checkbox from "../../components/MedicationSchedule/Checkbox"
import MedicationConfirmModal from "../../components/MedicationSchedule/MedicationConfirmModal"
import type { DateOption, TimeSlot, Medication } from "./type"
import { colors } from "../../styles/globalStyles"

const getCurrentTime = () => {
  const now = new Date()
  return now.toLocaleTimeString('vi-VN', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  })
}

const getCurrentDate = () => {
  const now = new Date()
  return {
    day: now.getDate(),
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    dayOfWeek: now.toLocaleDateString('vi-VN', { weekday: 'short' })
  }
}

const generateDateOptions = (): DateOption[] => {
  const today = new Date()
  const dates: DateOption[] = []
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    
    const dayNames = ['CN', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7']
    const dayName = i === 0 ? 'Hôm nay' : dayNames[date.getDay()]
    
    dates.push({
      id: i + 1,
      day: dayName,
      date: date.getDate(),
      disabled: false,
      fullDate: date.toISOString().split('T')[0]  
    })
  }
  
  return dates
}

const isTimeReached = (medicationTime: string): boolean => {
  const now = new Date()
  const [hours, minutes] = medicationTime.split(':').map(Number)
  const medicationDateTime = new Date()
  medicationDateTime.setHours(hours, minutes, 0, 0)
  
  return now >= medicationDateTime
}

const getTimeUntilMedication = (medicationTime: string): string => {
  const now = new Date()
  const [hours, minutes] = medicationTime.split(':').map(Number)
  const medicationDateTime = new Date()
  medicationDateTime.setHours(hours, minutes, 0, 0)
  
  if (medicationDateTime <= now) {
    return "Đã đến giờ"
  }
  
  const timeDiff = medicationDateTime.getTime() - now.getTime()
  const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60))
  const minutesDiff = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hoursDiff > 0) {
    return `Còn ${hoursDiff}h ${minutesDiff}m`
  } else {
    return `Còn ${minutesDiff}m`
  }
}

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
        status: "pending",
      },
      {
        id: "2",
        name: "Vitamin C 500mg",
        dosage: "Dùng 1 viên",
        time: "08:00",
        instructions: "Uống sau ăn",
        status: "pending",
      },
    ],
  },
  {
    id: "2",
    period: "Buổi trưa",
    icon: "noon",
    medications: [
      {
        id: "3",
        name: "Ambroxol HCl (Medovent 30mg)",
        dosage: "Dùng 1 viên",
        time: "12:30",
        instructions: "",
        status: "pending",
      },
    ],
  },
  {
    id: "3",
    period: "Buổi tối",
    icon: "evening",
    medications: [
      {
        id: "4",
        name: "Ambroxol HCl (Medovent 30mg)",
        dosage: "Dùng 1 viên",
        time: "19:30",
        instructions: "",
        status: "pending",
      },
      {
        id: "5",
        name: "Calcium 600mg",
        dosage: "Dùng 1 viên",
        time: "20:00",
        instructions: "Uống trước khi đi ngủ",
        status: "pending",
      },
    ],
  },
]

interface MedicationScheduleScreenProps {
  onManagePrescriptions?: () => void
  customDateOptions?: DateOption[]
  customTimeSlots?: TimeSlot[]
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
  
  const [currentTime, setCurrentTime] = useState(getCurrentTime())
  const [dateOptions, setDateOptions] = useState<DateOption[]>(customDateOptions || generateDateOptions())
  const [medicationReminders, setMedicationReminders] = useState<string[]>([])

  const navigation = useNavigation()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTime())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date()
      const reminders: string[] = []
      
      medications.forEach(timeSlot => {
        timeSlot.medications.forEach(medication => {
          if (medication.status === 'pending') {
            const [hours, minutes] = medication.time.split(':').map(Number)
            const medicationTime = new Date()
            medicationTime.setHours(hours, minutes, 0, 0)
            
            const reminderTime = new Date(medicationTime.getTime() - 15 * 60 * 1000)
            
            if (now >= reminderTime && now <= medicationTime) {
              reminders.push(`${medication.name} - ${medication.time}`)
            }
          }
        })
      })
      
      setMedicationReminders(reminders)
    }

    const reminderTimer = setInterval(checkReminders, 60000) 
    checkReminders()

    return () => clearInterval(reminderTimer)
  }, [medications])

  useEffect(() => {
    const updateMedicationStatus = () => {
      setMedications(prevMedications => 
        prevMedications.map(timeSlot => ({
          ...timeSlot,
          medications: timeSlot.medications.map(medication => {
            if (medication.status === 'pending' && isTimeReached(medication.time)) {
              const now = new Date()
              const [hours, minutes] = medication.time.split(':').map(Number)
              const medicationTime = new Date()
              medicationTime.setHours(hours, minutes, 0, 0)
              const hoursPassed = (now.getTime() - medicationTime.getTime()) / (1000 * 60 * 60)
              
              if (hoursPassed > 2) { 
                return { ...medication, status: 'overdue' as any }
              }
            }
            return medication
          })
        }))
      )
    }

    const statusTimer = setInterval(updateMedicationStatus, 60000)
    return () => clearInterval(statusTimer)
  }, [])

  const handleMedicationPress = (timeSlotId: string, medication: Medication) => {
    setSelectedMedication({ medication, timeSlotId })
    setModalVisible(true)
  }

  const handleConfirmMedication = () => {
    if (!selectedMedication) return

    setMedications((prevSlots) =>
      prevSlots.map((slot) => {
        if (slot.id === selectedMedication.timeSlotId) {
          return {
            ...slot,
            medications: slot.medications.map((med) => {
              if (med.id === selectedMedication.medication.id) {
                return { 
                  ...med, 
                  status: "taken",
                  takenAt: getCurrentTime()
                }
              }
              return med
            }),
          }
        }
        return slot
      }),
    )

    setModalVisible(false)
    setSelectedMedication(null)
  }

  const handleCancelMedication = () => {
    if (!selectedMedication) return

    setMedications((prevSlots) =>
      prevSlots.map((slot) => {
        if (slot.id === selectedMedication.timeSlotId) {
          return {
            ...slot,
            medications: slot.medications.map((med) => {
              if (med.id === selectedMedication.medication.id) {
                return { 
                  ...med, 
                  status: "canceled",
                  canceledAt: getCurrentTime()
                }
              }
              return med
            }),
          }
        }
        return slot
      }),
    )

    setModalVisible(false)
    setSelectedMedication(null)
  }

  const handleAdjustMedication = () => {
    setModalVisible(false)
    setSelectedMedication(null)
  }

  const handleCloseModal = () => {
    setModalVisible(false)
    setSelectedMedication(null)
  }

  const renderIcon = (icon: "morning" | "noon" | "evening") => {
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

  const renderMedicationStatus = (medication: Medication) => {
    if (medication.status === 'pending' && isTimeReached(medication.time)) {
      return (
        <View style={styles.overdueIndicator}>
          <Text style={styles.overdueText}>Quá giờ</Text>
        </View>
      )
    }
    return null
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Header
        title="Đơn thuốc"
        showBack={false}
        showAction={true}
        actionType="notification"
        onActionPress={() => navigation.navigate("Notifications")}
      />

      {/* Medication Reminders */}
      {medicationReminders.length > 0 && (
        <View style={styles.reminderContainer}>
          <Text style={[styles.reminderTitle, { fontFamily: fontFamily.medium }]}>
            Nhắc nhở uống thuốc
          </Text>
          {medicationReminders.map((reminder, index) => (
            <Text key={index} style={[styles.reminderText, { fontFamily: fontFamily.regular }]}>
              {reminder}
            </Text>
          ))}
        </View>
      )}

      {/* Date Selector */}
      <View style={styles.dateSelector}>
        <FlatList
          data={dateOptions}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateList}
          renderItem={({ item }) => (
            <DateCard 
              date={item} 
              isSelected={item.id === selectedDateId} 
              onPress={() => setSelectedDateId(item.id)} 
            />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>

      {/* Medication Schedule Title */}
      <Text style={[styles.scheduleTitle, { fontFamily: fontFamily.medium }]}>
        Lịch uống thuốc hôm nay
      </Text>

      {/* Medication List */}
      <ScrollView style={styles.medicationList}>
        <View style={styles.medicationContainer}>
          {medications.map((timeSlot, index) => (
            <View key={timeSlot.id}>
              <View style={styles.timeSlotSection}>
                <View style={styles.timeSlotHeader}>
                  {renderIcon(timeSlot.icon)}
                  <Text style={[styles.timeSlotTitle, { fontFamily: fontFamily.medium }]}>
                    {timeSlot.period}
                  </Text>
                </View>

                {timeSlot.medications.map((medication) => (
                  <TouchableOpacity
                    key={medication.id}
                    style={[
                      styles.medicationItem,
                      medication.status === 'pending' && isTimeReached(medication.time) && styles.overdueMedicationItem
                    ]}
                    onPress={() => handleMedicationPress(timeSlot.id, medication)}
                    activeOpacity={0.7}
                  >
                    <Checkbox status={medication.status || "pending"} />
                    <View style={styles.medicationDetails}>
                      <View style={styles.medicationHeader}>
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
                        {renderMedicationStatus(medication)}
                      </View>
                      <Text
                        style={[
                          styles.medicationTime,
                          { fontFamily: fontFamily.regular },
                          medication.status === "taken" && styles.takenMedicationTimeText,
                          medication.status === "canceled" && styles.canceledMedicationTimeText,
                        ]}
                      >
                        <Text style={[styles.timeHighlight, { fontFamily: fontFamily.medium }]}>
                          {medication.time}
                        </Text>{" "}
                        - {medication.dosage}
                      </Text>
                      {medication.instructions && (
                        <Text style={[styles.medicationInstructions, { fontFamily: fontFamily.regular }]}>
                          {medication.instructions}
                        </Text>
                      )}
                      {/* Real-time countdown */}
                      {medication.status === 'pending' && (
                        <Text style={[styles.timeCountdown, { fontFamily: fontFamily.regular }]}>
                          {getTimeUntilMedication(medication.time)}
                        </Text>
                      )}
                      {/* Show when taken */}
                      {medication.status === 'taken' && (medication as any).takenAt && (
                        <Text style={[styles.takenTime, { fontFamily: fontFamily.regular }]}>
                          Đã uống lúc {(medication as any).takenAt}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {index < medications.length - 1 && <View style={styles.dottedDivider} />}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Manage Prescriptions Button */}
      <TouchableOpacity 
        style={styles.manageButton} 
        onPress={() => navigation.navigate("PrescriptionManagement")}
      >
        <Text style={[styles.manageButtonText, { fontFamily: fontFamily.medium }]}>
          Quản lý đơn thuốc
        </Text>
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
  clockContainer: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  currentTime: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.base500,
    marginBottom: 4,
  },
  currentDate: {
    fontSize: 14,
    color: "#666",
  },
  reminderContainer: {
    backgroundColor: "#FFF3CD",
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#FFC107",
  },
  reminderTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#856404",
    marginBottom: 4,
  },
  reminderText: {
    fontSize: 12,
    color: "#856404",
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
    alignItems: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  overdueMedicationItem: {
    backgroundColor: "#FEF2F2",
    borderLeftWidth: 3,
    borderLeftColor: "#EF4444",
  },
  medicationDetails: {
    marginLeft: 16,
    flex: 1,
  },
  medicationHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  medicationName: {
    fontSize: 15,
    color: "#333",
    marginBottom: 6,
    fontWeight: "500",
    flex: 1,
  },
  medicationTime: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  medicationInstructions: {
    fontSize: 12,
    color: "#888",
    fontStyle: "italic",
    marginBottom: 4,
  },
  timeCountdown: {
    fontSize: 12,
    color: colors.base500,
    fontWeight: "500",
  },
  takenTime: {
    fontSize: 12,
    color: "#10B981",
    fontWeight: "500",
  },
  timeHighlight: {
    fontWeight: "600",
    color: colors.base500,
  },
  overdueIndicator: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  overdueText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  takenMedicationText: {
    color: colors.base500,
    textDecorationLine: "line-through",
  },
  takenMedicationTimeText: {
    color: colors.base500,
  },
  canceledMedicationText: {
    color: "#FF5252",
    textDecorationLine: "line-through",
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