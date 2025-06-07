"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { fontFamily } from "../../../context/FontContext"
import { colors } from "../../../styles/globalStyles"

interface EditReminderModalProps {
  visible: boolean
  onClose: () => void
  onSave: (time: string, dosage: number) => void
  initialTime?: string
  initialDosage?: number
}

const { height: screenHeight } = Dimensions.get("window")

const EditReminderModal: React.FC<EditReminderModalProps> = ({
  visible,
  onClose,
  onSave,
  initialTime = "08:00",
  initialDosage = 1,
}) => {
  // Parse initial time
  const [hour, minute, period] = initialTime.includes(":")
    ? [
        Number.parseInt(initialTime.split(":")[0]),
        Number.parseInt(initialTime.split(":")[1]),
        Number.parseInt(initialTime.split(":")[0]) >= 12 ? "PM" : "AM",
      ]
    : [8, 0, "AM"]

  const [selectedHour, setSelectedHour] = useState(hour > 12 ? hour - 12 : hour === 0 ? 12 : hour)
  const [selectedMinute, setSelectedMinute] = useState(minute)
  const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM">(period as "AM" | "PM")
  const [dosage, setDosage] = useState(initialDosage)

  // ScrollView refs
  const hourScrollRef = useRef<ScrollView>(null)
  const minuteScrollRef = useRef<ScrollView>(null)
  const periodScrollRef = useRef<ScrollView>(null)

  const hours = Array.from({ length: 12 }, (_, i) => i + 1)
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5)
  const periods = ["AM", "PM"]

  // Reset values when modal becomes visible or initialTime/initialDosage changes
  useEffect(() => {
    if (visible) {
      const [newHour, newMinute, newPeriod] = initialTime.includes(":")
        ? [
            Number.parseInt(initialTime.split(":")[0]),
            Number.parseInt(initialTime.split(":")[1]),
            Number.parseInt(initialTime.split(":")[0]) >= 12 ? "PM" : "AM",
          ]
        : [8, 0, "AM"]

      setSelectedHour(newHour > 12 ? newHour - 12 : newHour === 0 ? 12 : newHour)
      setSelectedMinute(newMinute)
      setSelectedPeriod(newPeriod as "AM" | "PM")
      setDosage(initialDosage || 1)

      // Scroll to initial positions
      setTimeout(() => {
        const hourIndex = hours.findIndex((h) => h === (newHour > 12 ? newHour - 12 : newHour === 0 ? 12 : newHour))
        const minuteIndex = minutes.findIndex((m) => m === newMinute)
        const periodIndex = periods.findIndex((p) => p === newPeriod)

        hourScrollRef.current?.scrollTo({ y: hourIndex * 50, animated: false })
        minuteScrollRef.current?.scrollTo({ y: minuteIndex * 50, animated: false })
        periodScrollRef.current?.scrollTo({ y: periodIndex * 50, animated: false })
      }, 100)
    }
  }, [visible, initialTime, initialDosage])

  const handleSave = () => {
    let finalHour = selectedHour
    if (selectedPeriod === "PM" && selectedHour !== 12) {
      finalHour += 12
    } else if (selectedPeriod === "AM" && selectedHour === 12) {
      finalHour = 0
    }

    const timeString = `${finalHour.toString().padStart(2, "0")}:${selectedMinute.toString().padStart(2, "0")}`
    onSave(timeString, dosage)
  }

  const handleScroll = (
    event: any,
    items: (string | number)[],
    setSelectedValue: (value: any) => void,
    itemHeight = 50,
  ) => {
    const y = event.nativeEvent.contentOffset.y
    const index = Math.round(y / itemHeight)
    if (index >= 0 && index < items.length) {
      setSelectedValue(items[index])
    }
  }

  const renderScrollPicker = (
    items: (string | number)[],
    selectedValue: string | number,
    onValueChange: (value: any) => void,
    width: number,
    scrollRef: React.RefObject<ScrollView>,
  ) => (
    <View style={[styles.pickerOuterContainer, { width }]}>
      <View style={styles.pickerContainer}>
        <View style={styles.pickerHighlight} />
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={50}
          decelerationRate="fast"
          contentContainerStyle={styles.pickerContent}
          onMomentumScrollEnd={(event) => handleScroll(event, items, onValueChange)}
          onScrollEndDrag={(event) => handleScroll(event, items, onValueChange)}
        >
          {items.map((item, index) => (
            <View key={index} style={styles.pickerItem}>
              <Text
                style={[
                  styles.pickerItemText,
                  { fontFamily: fontFamily.medium },
                  selectedValue === item && styles.selectedPickerItemText,
                ]}
              >
                {typeof item === "number" ? item.toString().padStart(2, "0") : item}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  )

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { fontFamily: fontFamily.medium }]}>Thời gian uống thuốc</Text>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={[styles.cancelButtonText, { fontFamily: fontFamily.regular }]}>Hủy</Text>
            </TouchableOpacity>
          </View>

          {/* Time Picker Section */}
          <View style={styles.timeSection}>
            <Text style={[styles.sectionTitle, { fontFamily: fontFamily.medium }]}>Thời gian</Text>

            <View style={styles.timePickerContainer}>
              {/* Hour Picker */}
              {renderScrollPicker(hours, selectedHour, setSelectedHour, 80, hourScrollRef)}

              {/* Colon Separator */}
              <View style={styles.colonContainer}>
                <Text style={[styles.colon, { fontFamily: fontFamily.medium }]}>:</Text>
              </View>

              {/* Minute Picker */}
              {renderScrollPicker(minutes, selectedMinute, setSelectedMinute, 80, minuteScrollRef)}

              {/* AM/PM Picker */}
              {renderScrollPicker(periods, selectedPeriod, setSelectedPeriod, 80, periodScrollRef)}
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Dosage Section */}
          <View style={styles.dosageSection}>
            <Text style={[styles.sectionTitle, { fontFamily: fontFamily.medium }]}>Liều lượng</Text>

            <View style={styles.dosageContainer}>
              <TouchableOpacity style={styles.dosageButton} onPress={() => setDosage(Math.max(1, dosage - 1))}>
                <Icon name="remove" size={24} color="#fff" />
              </TouchableOpacity>

              <View style={styles.dosageDisplay}>
                <Text style={[styles.dosageText, { fontFamily: fontFamily.medium }]}>{dosage}</Text>
              </View>

              <TouchableOpacity style={styles.dosageButton} onPress={() => setDosage(dosage + 1)}>
                <Icon name="add" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={[styles.saveButtonText, { fontFamily: fontFamily.medium }]}>Lưu</Text>
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
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    maxHeight: screenHeight * 0.8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 18,
    color: "#333",
    fontWeight: "600",
  },
  cancelButton: {
    padding: 5,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#999",
  },
  timeSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    fontWeight: "500",
  },
  timePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingVertical: 10,
  },
  pickerOuterContainer: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  pickerContainer: {
    position: "relative",
    height: 150,
    width: "100%",
    overflow: "hidden",
  },
  pickerHighlight: {
    position: "absolute",
    top: 50,
    left: 5,
    right: 5,
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  pickerContent: {
    paddingVertical: 50,
  },
  pickerItem: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  pickerItemText: {
    fontSize: 18,
    color: "#999",
  },
  selectedPickerItemText: {
    color: "#333",
    fontWeight: "600",
  },
  colonContainer: {
    width: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  colon: {
    fontSize: 24,
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 20,
  },
  dosageSection: {
    marginBottom: 30,
  },
  dosageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dosageButton: {
    width: 50,
    height: 50,
    backgroundColor: colors.base500,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  dosageDisplay: {
    width: 100,
    height: 50,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 16,
  },
  dosageText: {
    fontSize: 24,
    color: "#333",
  },
  saveButton: {
    backgroundColor: colors.base500,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default EditReminderModal
