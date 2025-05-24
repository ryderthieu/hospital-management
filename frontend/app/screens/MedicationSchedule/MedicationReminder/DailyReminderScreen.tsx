"use client"

import type React from "react"
import { useState } from "react"
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { fontFamily } from "../../../context/FontContext"
import EditReminderModal from "../../../components/MedicationSchedule/MedicationReminder/EditReminderModal"
import DeleteReminderModal from "../../../components/MedicationSchedule/MedicationReminder/DeleteReminderModal"
import { colors } from "../../../styles/globalStyles"
import type { MedicationReminderSettings, MedicationReminder } from "../type"

const sampleDailyReminderSettings: MedicationReminderSettings = {
  medicationId: "1",
  medicationName: "Ambroxol HCl (Medovent 30mg)",
  remainingQuantity: 30,
  unit: "Viên",
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

const DailyReminderScreen: React.FC = () => {
  const [reminderSettings, setReminderSettings] = useState<MedicationReminderSettings>(sampleDailyReminderSettings)
  const [notificationsEnabled, setNotificationsEnabled] = useState(reminderSettings.notificationsEnabled)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [editingReminder, setEditingReminder] = useState<MedicationReminder | null>(null)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [deletingReminderId, setDeletingReminderId] = useState<string | null>(null)
  const [isAddingNewReminder, setIsAddingNewReminder] = useState(false)

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
    console.log("Saving daily reminder settings")
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

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled)
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

        {/* Medication Quantity */}
        <View style={styles.quantityContainer}>
          <View style={styles.pillIconContainer}>
            <View style={styles.pillIcon}>
              <View style={styles.pillLeft} />
              <View style={styles.pillRight} />
            </View>
          </View>
          <Text style={[styles.quantityLabel, { fontFamily: fontFamily.regular }]}>Số lượng thuốc còn lại:</Text>
          <Text style={[styles.quantityValue, { fontFamily: fontFamily.medium }]}>
            {reminderSettings.remainingQuantity} {reminderSettings.unit}
          </Text>
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
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={[styles.saveButtonText, { fontFamily: fontFamily.medium }]}>Lưu</Text>
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
    </View>
  )
}

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
    marginBottom: 16,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  pillIconContainer: {
    marginRight: 12,
  },
  pillIcon: {
    width: 24,
    height: 24,
    flexDirection: "row",
    borderRadius: 12,
    overflow: "hidden",
  },
  pillLeft: {
    flex: 1,
    backgroundColor: colors.base500,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  pillRight: {
    flex: 1,
    backgroundColor: "#4FC3F7",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  quantityLabel: {
    fontSize: 14,
    color: "#333",
  },
  quantityValue: {
    fontSize: 14,
    color: colors.base500,
    marginLeft: 8,
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
})

export default DailyReminderScreen