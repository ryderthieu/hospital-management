"use client"

import type React from "react"
import { useState } from "react"
import { StyleSheet, View, Text, TouchableOpacity, Modal, TextInput, Platform, Pressable } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useFont, fontFamily } from "../../context/FontContext";
import DateTimePicker, { type DateTimePickerEvent } from "@react-native-community/datetimepicker"

interface DateFilterModalProps {
  visible: boolean
  onClose: () => void
  onApply: (startDate: Date | null, endDate: Date | null) => void
}

const DateFilterModal: React.FC<DateFilterModalProps> = ({ visible, onClose, onApply }) => {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [showStartDatePicker, setShowStartDatePicker] = useState(false)
  const [showEndDatePicker, setShowEndDatePicker] = useState(false)
    const { fontsLoaded } = useFont()

  const formatDate = (date: Date | null): string => {
    if (!date) return ""
    return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`
  }

  const handleStartDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || startDate
    setShowStartDatePicker(Platform.OS === "ios")
    if (currentDate) {
      setStartDate(currentDate)
    }
  }

  const handleEndDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || endDate
    setShowEndDatePicker(Platform.OS === "ios")
    if (currentDate) {
      setEndDate(currentDate)
    }
  }

  const handleReset = () => {
    setStartDate(null)
    setEndDate(null)
  }

  const handleApply = () => {
    onApply(startDate, endDate)
    onClose()
  }

  const setToday = () => {
    const today = new Date()
    setStartDate(today)
    setEndDate(today)
  }

  const setThisWeek = () => {
    const today = new Date()
    const firstDay = new Date(today)
    const day = today.getDay() || 7
    firstDay.setDate(today.getDate() - day + 1)

    const lastDay = new Date(firstDay)
    lastDay.setDate(firstDay.getDate() + 6)

    setStartDate(firstDay)
    setEndDate(lastDay)
  }

  const setThisMonth = () => {
    const today = new Date()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    setStartDate(firstDay)
    setEndDate(lastDay)
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Khoảng thời gian</Text>
            <TouchableOpacity onPress={handleReset}>
              <Text style={styles.resetButton}>Đặt lại</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dateRangeContainer}>
            <View style={styles.dateInputContainer}>
              <Text style={styles.dateLabel}>Từ</Text>
              <Pressable style={styles.dateInput} onPress={() => setShowStartDatePicker(true)}>
                <TextInput
                  style={styles.dateInputText}
                  value={formatDate(startDate)}
                  placeholder="DD-MM-YYYY"
                  editable={false}
                />
                <Ionicons name="calendar-outline" size={24} color="#9CA3AF" />
              </Pressable>
            </View>

            <View style={styles.dateInputContainer}>
              <Text style={styles.dateLabel}>Đến</Text>
              <Pressable style={styles.dateInput} onPress={() => setShowEndDatePicker(true)}>
                <TextInput
                  style={styles.dateInputText}
                  value={formatDate(endDate)}
                  placeholder="DD-MM-YYYY"
                  editable={false}
                />
                <Ionicons name="calendar-outline" size={24} color="#9CA3AF" />
              </Pressable>
            </View>
          </View>

          <View style={styles.quickFiltersContainer}>
            <TouchableOpacity style={styles.quickFilterButton} onPress={setToday}>
              <Text style={styles.quickFilterText}>Hôm nay</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickFilterButton} onPress={setThisWeek}>
              <Text style={styles.quickFilterText}>Tuần này</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickFilterButton} onPress={setThisMonth}>
              <Text style={styles.quickFilterText}>Tháng này</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Áp dụng</Text>
          </TouchableOpacity>

          {showStartDatePicker && (
            <DateTimePicker
              value={startDate || new Date()}
              mode="date"
              display="default"
              onChange={handleStartDateChange}
            />
          )}

          {showEndDatePicker && (
            <DateTimePicker
              value={endDate || new Date()}
              mode="date"
              display="default"
              onChange={handleEndDateChange}
            />
          )}
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
  },
  resetButton: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: "#0BC5C5",
  },
  dateRangeContainer: {
    marginBottom: 20,
  },
  dateInputContainer: {
    marginBottom: 16,
  },
  dateLabel: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    marginBottom: 8,
    color: "#4B5563",
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#F9FAFB",
  },
  dateInputText: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    flex: 1,
  },
  quickFiltersContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  quickFilterButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 4,
  },
  quickFilterText: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: "#4B5563",
  },
  applyButton: {
    backgroundColor: "#0BC5C5",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  applyButtonText: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: "#FFFFFF",
  },
})

export default DateFilterModal
