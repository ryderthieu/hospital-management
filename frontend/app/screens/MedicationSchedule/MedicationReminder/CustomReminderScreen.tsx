"use client"

import type React from "react"
import { useState } from "react"
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { fontFamily } from "../../../context/FontContext"
import EditReminderModal from "../../../components/MedicationSchedule/MedicationReminder/EditReminderModal"
import DeleteReminderModal from "../../../components/MedicationSchedule/MedicationReminder/DeleteReminderModal"
import RepeatFrequencyModal from "../../../components/MedicationSchedule/MedicationReminder/RepeatFrequencyModal"
import DatePickerModal from "../../../components/MedicationSchedule/MedicationReminder/DatePickerModal"
import MedicationQuantityModal from "../../../components/MedicationSchedule/MedicationReminder/MedicationQuantityModal"
import IntervalModal from "../../../components/MedicationSchedule/MedicationReminder/IntervalModal"
import WeekdaySelectionModal from "../../../components/MedicationSchedule/MedicationReminder/WeekdaySelectionModal"
import { colors } from "../../../styles/globalStyles"
import type { MedicationReminderSettings, MedicationReminder } from "../type"

const sampleCustomReminderSettings: MedicationReminderSettings = {
  medicationId: "1",
  medicationName: "Ambroxol HCl (Medovent 30mg)",
  remainingQuantity: 84,
  unit: "Viên",
  startDate: "27/04/2024",
  repeatFrequency: "NGÀY CỤ THỂ",
  repeatInterval: { value: 1, unit: "NGÀY" },
  selectedWeekdays: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
  reminders: [
    {
      id: "1",
      time: "08:00",
      dosage: "Dùng 1 viên",
      isActive: true,
    },
    {
      id: "2",
      time: "12:00",
      dosage: "Dùng 1 viên",
      isActive: true,
    },
    {
      id: "3",
      time: "18:00",
      dosage: "Dùng 1 viên",
      isActive: true,
    },
  ],
  notificationsEnabled: true,
}

interface CustomReminderScreenProps {
  navigation?: any
  onSaveAndGoBack?: (settings: MedicationReminderSettings) => void
}

const CustomReminderScreen: React.FC<CustomReminderScreenProps> = ({ navigation, onSaveAndGoBack }) => {
  const [reminderSettings, setReminderSettings] = useState<MedicationReminderSettings>(sampleCustomReminderSettings)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [editingReminder, setEditingReminder] = useState<MedicationReminder | null>(null)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [deletingReminderId, setDeletingReminderId] = useState<string | null>(null)
  const [isAddingNewReminder, setIsAddingNewReminder] = useState(false)
  const [repeatFrequencyModalVisible, setRepeatFrequencyModalVisible] = useState(false)
  const [intervalModalVisible, setIntervalModalVisible] = useState(false)
  const [weekdaySelectionModalVisible, setWeekdaySelectionModalVisible] = useState(false)
  const [datePickerModalVisible, setDatePickerModalVisible] = useState(false)
  const [medicationQuantityModalVisible, setMedicationQuantityModalVisible] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleAddReminder = () => {
    setIsAddingNewReminder(true)
    setEditModalVisible(true)
  }

  const handleEditReminder = (reminderId: string) => {
    const reminder = reminderSettings.reminders.find((r) => r.id === reminderId)
    if (reminder) {
      setIsAddingNewReminder(false)
      setEditingReminder(reminder)
      setEditModalVisible(true)
    }
  }

  const handleDeleteReminder = (reminderId: string) => {
    setDeletingReminderId(reminderId)
    setDeleteModalVisible(true)
  }

  const confirmDeleteReminder = () => {
    if (deletingReminderId) {
      const updatedReminders = reminderSettings.reminders.filter((reminder) => reminder.id !== deletingReminderId)
      setReminderSettings({
        ...reminderSettings,
        reminders: updatedReminders,
      })
      setDeleteModalVisible(false)
      setDeletingReminderId(null)
    }
  }

  const handleSave = () => {
    setIsSaving(true)

    // Giả lập thời gian lưu (có thể bỏ nếu không cần)
    setTimeout(() => {
      console.log("Saving custom reminder settings:", reminderSettings)

      // Hiển thị thông báo thành công (tùy chọn)
      alert("Đã lưu lịch nhắc thuốc thành công!")

      // Nếu có callback onSaveAndGoBack, gọi nó với dữ liệu đã cập nhật
      if (onSaveAndGoBack) {
        onSaveAndGoBack(reminderSettings)
      }

      // Nếu có navigation, quay lại màn hình trước đó
      if (navigation) {
        navigation.goBack()
      } else {
        // Fallback cho trường hợp không có navigation
        console.log("Navigation not available, data saved but cannot navigate back")
      }

      setIsSaving(false)
    }, 500)
  }

  const handleSaveEditedReminder = (time: string, dosage: number) => {
    if (isAddingNewReminder) {
      const newReminder: MedicationReminder = {
        id: Date.now().toString(),
        time,
        dosage: `Dùng ${dosage} viên`,
        isActive: true,
      }
      setReminderSettings({
        ...reminderSettings,
        reminders: [...reminderSettings.reminders, newReminder],
      })
    } else if (editingReminder) {
      const updatedReminders = reminderSettings.reminders.map((reminder) =>
        reminder.id === editingReminder.id ? { ...reminder, time, dosage: `Dùng ${dosage} viên` } : reminder,
      )
      setReminderSettings({
        ...reminderSettings,
        reminders: updatedReminders,
      })
    }

    setEditModalVisible(false)
    setEditingReminder(null)
    setIsAddingNewReminder(false)
  }

  const handleRepeatFrequencyPress = () => {
    setRepeatFrequencyModalVisible(true)
  }

  const handleIntervalPress = () => {
    setIntervalModalVisible(true)
  }

  const handleWeekdaySelectionPress = () => {
    setWeekdaySelectionModalVisible(true)
  }

  const handleStartDatePress = () => {
    setDatePickerModalVisible(true)
  }

  const handleQuantityConfirm = (data: {
    quantity: number
    reminderEnabled: boolean
    reminderThreshold: number
    reminderTimes: string[]
  }) => {
    setReminderSettings({
      ...reminderSettings,
      remainingQuantity: data.quantity,
      notificationsEnabled: data.reminderEnabled,
      // Lưu thêm dữ liệu nếu cần
    })
    setMedicationQuantityModalVisible(false)
  }

  const handleQuantityPress = () => {
    setMedicationQuantityModalVisible(true)
  }

  const handleSelectFrequency = (frequency: string, interval?: { value: number; unit: string }) => {
    setReminderSettings({
      ...reminderSettings,
      repeatFrequency: frequency,
      repeatInterval: interval || { value: 1, unit: "NGÀY" },
    })
    setRepeatFrequencyModalVisible(false)
  }

  const handleSelectInterval = (interval: { value: number; unit: string }) => {
    setReminderSettings({
      ...reminderSettings,
      repeatInterval: interval,
    })
    setIntervalModalVisible(false)
  }

  const handleSelectWeekdays = (selectedDays: string[]) => {
    setReminderSettings({
      ...reminderSettings,
      selectedWeekdays: selectedDays,
    })
    setWeekdaySelectionModalVisible(false)
  }

  const handleSelectDate = (date: string) => {
    setReminderSettings({
      ...reminderSettings,
      startDate: date,
    })
    setDatePickerModalVisible(false)
  }

  // Hàm để hiển thị văn bản khoảng thời gian
  const getIntervalText = () => {
    if (!reminderSettings.repeatInterval) return "MỖI 1 NGÀY"
    return `MỖI ${reminderSettings.repeatInterval.value} ${reminderSettings.repeatInterval.unit}`
  }

  // Hàm để hiển thị các ngày đã chọn
  const getSelectedWeekdaysText = () => {
    if (!reminderSettings.selectedWeekdays || reminderSettings.selectedWeekdays.length === 0) return ""
    return reminderSettings.selectedWeekdays.join(", ")
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Medication Info */}
        <View style={styles.medicationInfo}>
          <Text style={[styles.infoLabel, { fontFamily: fontFamily.regular }]}>Tên thuốc:</Text>
          <Text style={[styles.infoValue, { fontFamily: fontFamily.medium }]}>{reminderSettings.medicationName}</Text>
        </View>

        <View style={styles.divider} />

        {/* Custom Settings Card */}
        <View style={styles.settingsCard}>
          {/* Repeat Frequency Row */}
          <TouchableOpacity style={styles.settingRow} onPress={handleRepeatFrequencyPress}>
            <View style={styles.settingIconContainer}>
              <Icon name="schedule" size={24} color={colors.base500} />
            </View>
            <Text style={[styles.settingLabel, { fontFamily: fontFamily.regular }]}>Thời gian lặp</Text>
            <View style={styles.settingValueContainer}>
              <Text style={[styles.settingValue, { fontFamily: fontFamily.medium }]}>
                {reminderSettings.repeatFrequency}
              </Text>
              <Icon name="chevron-right" size={24} color="#999" />
            </View>
          </TouchableOpacity>

          {/* Hiển thị "Bao lâu 1 lần?" khi repeatFrequency là "KHOẢNG THỜI GIAN" */}
          {reminderSettings.repeatFrequency === "KHOẢNG THỜI GIAN" && (
            <>
              <View style={styles.settingDivider} />
              <TouchableOpacity style={styles.settingRow} onPress={handleIntervalPress}>
                <View style={styles.settingIconContainer}>
                  <Icon name="update" size={24} color={colors.base500} />
                </View>
                <Text style={[styles.settingLabel, { fontFamily: fontFamily.regular }]}>Bao lâu 1 lần?</Text>
                <View style={styles.settingValueContainer}>
                  <Text style={[styles.settingValue, { fontFamily: fontFamily.medium }]}>{getIntervalText()}</Text>
                  <Icon name="chevron-right" size={24} color="#999" />
                </View>
              </TouchableOpacity>
            </>
          )}

          {/* Hiển thị "Ngày nào?" khi repeatFrequency là "NGÀY CỤ THỂ" */}
          {reminderSettings.repeatFrequency === "NGÀY CỤ THỂ" && (
            <>
              <View style={styles.settingDivider} />
              <TouchableOpacity style={styles.settingRow} onPress={handleWeekdaySelectionPress}>
                <View style={styles.settingIconContainer}>
                  <Icon name="date-range" size={24} color={colors.base500} />
                </View>
                <Text style={[styles.settingLabel, { fontFamily: fontFamily.regular }]}>Ngày nào?</Text>
                <View style={styles.settingValueContainer}>
                  <Text style={[styles.settingValue, { fontFamily: fontFamily.medium }]}>
                    {getSelectedWeekdaysText()}
                  </Text>
                  <Icon name="chevron-right" size={24} color="#999" />
                </View>
              </TouchableOpacity>
            </>
          )}

          <View style={styles.settingDivider} />

          {/* Start Date Row */}
          <TouchableOpacity style={styles.settingRow} onPress={handleStartDatePress}>
            <View style={styles.settingIconContainer}>
              <Icon name="event" size={24} color={colors.base500} />
            </View>
            <Text style={[styles.settingLabel, { fontFamily: fontFamily.regular }]}>Ngày bắt đầu</Text>
            <View style={styles.settingValueContainer}>
              <Text style={[styles.settingValue, { fontFamily: fontFamily.medium }]}>{reminderSettings.startDate}</Text>
              <Icon name="chevron-right" size={24} color="#999" />
            </View>
          </TouchableOpacity>

          <View style={styles.settingDivider} />

          {/* Remaining Quantity Row */}
          <TouchableOpacity style={styles.settingRow} onPress={handleQuantityPress}>
            <View style={styles.settingIconContainer}>
              <Icon name="medical-services" size={24} color={colors.base500} />
            </View>
            <Text style={[styles.settingLabel, { fontFamily: fontFamily.regular }]}>Trong hộp</Text>
            <View style={styles.settingValueContainer}>
              <Text style={[styles.settingValue, { fontFamily: fontFamily.medium }]}>
                CÒN {reminderSettings.remainingQuantity} VIÊN
              </Text>
              <Icon name="chevron-right" size={24} color="#999" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Time and Dosage Settings */}
        <View style={styles.settingsContainer}>
          <View style={styles.timeSettingLabel}>
            <Icon name="access-time" size={20} color={colors.base500} style={styles.clockIcon} />
            <Text style={[styles.timeSettingText, { fontFamily: fontFamily.medium }]}>
              Cài đặt thời gian và liều lượng
            </Text>
          </View>

          <TouchableOpacity style={styles.addReminderButton} onPress={handleAddReminder}>
            <Icon name="add" size={16} color={colors.base500} style={styles.plusIcon} />
            <Text style={[styles.addReminderButtonText, { fontFamily: fontFamily.medium }]}>Thêm lịch nhắc</Text>
          </TouchableOpacity>
        </View>

        {/* Reminders List */}
        <View style={styles.remindersContainer}>
          {reminderSettings.reminders.map((reminder) => (
            <View key={reminder.id} style={styles.reminderItem}>
              <View style={styles.reminderTimeContainer}>
                <Text style={[styles.reminderTime, { fontFamily: fontFamily.medium }]}>{reminder.time}</Text>
              </View>
              <View style={styles.reminderDivider} />
              <View style={styles.reminderDosageContainer}>
                <Text style={[styles.reminderDosage, { fontFamily: fontFamily.regular }]}>{reminder.dosage}</Text>
              </View>
              <View style={styles.reminderActions}>
                <TouchableOpacity style={styles.editButton} onPress={() => handleEditReminder(reminder.id)}>
                  <Icon name="edit" size={20} color="#4CAF50" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteReminder(reminder.id)}>
                  <Icon name="delete" size={20} color="#FF5252" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Notification Settings */}
        <View style={styles.notificationContainer}>
          <View style={styles.notificationHeader}>
            <Text style={[styles.notificationTitle, { fontFamily: fontFamily.medium }]}>Nhắc nhở uống thuốc</Text>
          </View>
          <View style={styles.notificationContent}>
            <Text style={[styles.notificationDescription, { fontFamily: fontFamily.regular }]}>
              Nhận thông báo nhắc nhở khi đến giờ dùng thuốc
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={isSaving}
      >
        <Text style={[styles.saveButtonText, { fontFamily: fontFamily.medium }]}>
          {isSaving ? "Đang lưu..." : "Lưu"}
        </Text>
      </TouchableOpacity>

      {/* Edit/Add Reminder Modal */}
      <EditReminderModal
        visible={editModalVisible}
        onClose={() => {
          setEditModalVisible(false)
          setEditingReminder(null)
          setIsAddingNewReminder(false)
        }}
        onSave={handleSaveEditedReminder}
        initialTime={isAddingNewReminder ? "08:00" : editingReminder?.time}
        initialDosage={
          isAddingNewReminder
            ? 1
            : editingReminder
              ? Number.parseInt(editingReminder.dosage.match(/\d+/)?.[0] || "1")
              : 1
        }
      />

      {/* Delete Reminder Modal */}
      <DeleteReminderModal
        visible={deleteModalVisible}
        onClose={() => {
          setDeleteModalVisible(false)
          setDeletingReminderId(null)
        }}
        onConfirm={confirmDeleteReminder}
      />

      {/* Repeat Frequency Modal */}
      <RepeatFrequencyModal
        visible={repeatFrequencyModalVisible}
        onClose={() => setRepeatFrequencyModalVisible(false)}
        onSelect={handleSelectFrequency}
        selectedFrequency={reminderSettings.repeatFrequency}
        selectedInterval={reminderSettings.repeatInterval}
      />

      {/* Interval Modal */}
      <IntervalModal
        visible={intervalModalVisible}
        onClose={() => setIntervalModalVisible(false)}
        onSave={handleSelectInterval}
        initialInterval={reminderSettings.repeatInterval || { value: 1, unit: "NGÀY" }}
      />

      {/* Weekday Selection Modal */}
      <WeekdaySelectionModal
        visible={weekdaySelectionModalVisible}
        onClose={() => setWeekdaySelectionModalVisible(false)}
        onSave={handleSelectWeekdays}
        initialSelectedDays={reminderSettings.selectedWeekdays || []}
      />

      {/* Date Picker Modal */}
      <DatePickerModal
        visible={datePickerModalVisible}
        onClose={() => setDatePickerModalVisible(false)}
        onSelect={handleSelectDate}
        selectedDate={reminderSettings.startDate || "27/04/2024"}
      />

      <MedicationQuantityModal
        visible={medicationQuantityModalVisible}
        onClose={() => setMedicationQuantityModalVisible(false)}
        onConfirm={handleQuantityConfirm}
        initialData={{
          quantity: reminderSettings.remainingQuantity,
          reminderEnabled: reminderSettings.notificationsEnabled,
          reminderThreshold: 5,
          reminderTimes: ["08:00 AM"],
        }}
      />
    </View>
  )
}

// Styles giữ nguyên như trước
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  medicationInfo: {
    flexDirection: "row",
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    color: colors.base500,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginBottom: 24,
  },
  settingsCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  settingDivider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginLeft: 16,
    marginRight: 16,
    borderStyle: "dashed",
    borderWidth: 0.5,
    borderColor: "#E0E0E0",
  },
  settingIconContainer: {
    width: 30,
    alignItems: "center",
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  settingValueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingValue: {
    fontSize: 14,
    color: "#00BCD4",
    marginRight: 4,
  },
  settingsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  timeSettingLabel: {
    flexDirection: "row",
    alignItems: "center",
  },
  clockIcon: {
    marginRight: 12,
  },
  timeSettingText: {
    fontSize: 14,
    color: colors.base500,
  },
  addReminderButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E6F7F7",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  plusIcon: {
    marginRight: 8,
  },
  addReminderButtonText: {
    fontSize: 14,
    color: colors.base500,
  },
  remindersContainer: {
    marginBottom: 24,
  },
  reminderItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    overflow: "hidden",
  },
  reminderTimeContainer: {
    width: 120,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FFFE",
  },
  reminderTime: {
    fontSize: 28,
    color: colors.base500,
  },
  reminderDivider: {
    width: 1,
    backgroundColor: "#E0E0E0",
  },
  reminderDosageContainer: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  reminderDosage: {
    fontSize: 16,
    color: "#333",
  },
  reminderActions: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 16,
  },
  editButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  deleteButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationContainer: {
    marginBottom: 24,
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  notificationHeader: {
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    color: "#333",
  },
  notificationContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationDescription: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  saveButton: {
    backgroundColor: colors.base500,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    shadowColor: colors.base500,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButtonDisabled: {
    backgroundColor: "#B2DFDB",
    shadowOpacity: 0.1,
  },
})

export default CustomReminderScreen
