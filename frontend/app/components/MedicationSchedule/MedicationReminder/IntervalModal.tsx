"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput } from "react-native"
import { fontFamily } from "../../../context/FontContext"
import { colors } from "../../../styles/globalStyles"

interface IntervalModalProps {
  visible: boolean
  onClose: () => void
  onSave: (interval: { value: number; unit: string }) => void
  initialInterval: { value: number; unit: string }
}

const IntervalModal: React.FC<IntervalModalProps> = ({ visible, onClose, onSave, initialInterval }) => {
  const [intervalValue, setIntervalValue] = useState(initialInterval.value.toString())
  const [intervalUnit] = useState(initialInterval.unit)

  // Reset value when modal becomes visible
  useEffect(() => {
    if (visible) {
      setIntervalValue(initialInterval.value.toString())
    }
  }, [visible, initialInterval])

  const handleIncrement = () => {
    const currentValue = Number.parseInt(intervalValue) || 0
    setIntervalValue((currentValue + 1).toString())
  }

  const handleDecrement = () => {
    const currentValue = Number.parseInt(intervalValue) || 0
    if (currentValue > 1) {
      setIntervalValue((currentValue - 1).toString())
    }
  }

  const handleSave = () => {
    const value = Number.parseInt(intervalValue) || 1
    onSave({ value, unit: intervalUnit })
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={[styles.title, { fontFamily: fontFamily.medium }]}>Bao lâu 1 lần?</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={[styles.cancelButton, { fontFamily: fontFamily.regular }]}>Hủy</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={[styles.label, { fontFamily: fontFamily.regular }]}>Thời gian</Text>

            <View style={styles.intervalContainer}>
              <Text style={[styles.intervalText, { fontFamily: fontFamily.medium }]}>Mỗi</Text>

              <View style={styles.inputContainer}>
                <TouchableOpacity
                  style={styles.decrementButton}
                  onPress={handleDecrement}
                  disabled={Number.parseInt(intervalValue) <= 1}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      { fontFamily: fontFamily.medium },
                      Number.parseInt(intervalValue) <= 1 && styles.disabledButtonText,
                    ]}
                  >
                    −
                  </Text>
                </TouchableOpacity>

                <TextInput
                  style={[styles.input, { fontFamily: fontFamily.medium }]}
                  value={intervalValue}
                  onChangeText={(text) => {
                    // Only allow numbers
                    const numericValue = text.replace(/[^0-9]/g, "")
                    setIntervalValue(numericValue || "1")
                  }}
                  keyboardType="numeric"
                  textAlign="center"
                />

                <TouchableOpacity style={styles.incrementButton} onPress={handleIncrement}>
                  <Text style={[styles.buttonText, { fontFamily: fontFamily.medium }]}>+</Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.intervalText, { fontFamily: fontFamily.medium }]}>Ngày</Text>
            </View>
          </View>

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
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  title: {
    fontSize: 18,
    color: "#333333",
  },
  cancelButton: {
    fontSize: 16,
    color: "#999999",
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    color: "#333333",
    marginBottom: 20,
  },
  intervalContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  intervalText: {
    fontSize: 24,
    color: "#333333",
    marginHorizontal: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  decrementButton: {
    width: 60,
    height: 60,
    backgroundColor: "#E6F7F9",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  incrementButton: {
    width: 60,
    height: 60,
    backgroundColor: "#E6F7F9",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 24,
    color: colors.base500,
  },
  disabledButtonText: {
    color: "#CCCCCC",
  },
  input: {
    width: 80,
    height: 60,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    fontSize: 24,
    marginHorizontal: 10,
  },
  saveButton: {
    backgroundColor: colors.base500,
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
  },
})

export default IntervalModal
