"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView } from "react-native"
import { fontFamily } from "../../../context/FontContext"
import { colors } from "../../../styles/globalStyles"

interface WeekdaySelectionModalProps {
  visible: boolean
  onClose: () => void
  onSave: (selectedDays: string[]) => void
  initialSelectedDays: string[]
}

const WeekdaySelectionModal: React.FC<WeekdaySelectionModalProps> = ({
  visible,
  onClose,
  onSave,
  initialSelectedDays,
}) => {
  const [selectedDays, setSelectedDays] = useState<string[]>(initialSelectedDays)

  // Reset selected days when modal becomes visible
  useEffect(() => {
    if (visible) {
      setSelectedDays(initialSelectedDays)
    }
  }, [visible, initialSelectedDays])

  const weekdays = [
    { id: "T2", label: "Thứ 2" },
    { id: "T3", label: "Thứ 3" },
    { id: "T4", label: "Thứ 4" },
    { id: "T5", label: "Thứ 5" },
    { id: "T6", label: "Thứ 6" },
    { id: "T7", label: "Thứ 7" },
    { id: "CN", label: "Chủ nhật" },
  ]

  const toggleDay = (dayId: string) => {
    if (selectedDays.includes(dayId)) {
      setSelectedDays(selectedDays.filter((day) => day !== dayId))
    } else {
      setSelectedDays([...selectedDays, dayId])
    }
  }

  const handleSave = () => {
    onSave(selectedDays)
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={[styles.title, { fontFamily: fontFamily.medium }]}>Những ngày cụ thể</Text>
          </View>

          <ScrollView style={styles.content}>
            {weekdays.map((day) => (
              <TouchableOpacity
                key={day.id}
                style={styles.dayItem}
                onPress={() => toggleDay(day.id)}
                activeOpacity={0.7}
              >
                <Text style={[styles.dayText, { fontFamily: fontFamily.regular }]}>{day.label}</Text>
                <View style={[styles.checkbox, selectedDays.includes(day.id) && styles.checkboxSelected]}>
                  {selectedDays.includes(day.id) && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.confirmButton} onPress={handleSave}>
            <Text style={[styles.confirmButtonText, { fontFamily: fontFamily.medium }]}>Xác nhận</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
  },
  header: {
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  title: {
    fontSize: 18,
    color: "#333333",
  },
  content: {
    maxHeight: 400,
  },
  dayItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  dayText: {
    fontSize: 16,
    color: colors.base500,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  checkboxSelected: {
    backgroundColor: colors.base500,
    borderColor: colors.base500,
  },
  checkmark: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  confirmButton: {
    backgroundColor: colors.base500,
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
  },
})

export default WeekdaySelectionModal
