"use client"

import React from "react"
import { StyleSheet, Text, View, TouchableOpacity, Modal, TouchableWithoutFeedback } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { fontFamily } from "../../../context/FontContext"

interface RepeatFrequencyModalProps {
  visible: boolean
  onClose: () => void
  onSelect: (frequency: string) => void
  selectedFrequency: string
}

const RepeatFrequencyModal: React.FC<RepeatFrequencyModalProps> = ({
  visible,
  onClose,
  onSelect,
  selectedFrequency,
}) => {
  const frequencies = [
    { id: "daily", label: "Mỗi ngày", value: "MỖI NGÀY" },
    { id: "interval", label: "Khoảng thời gian", value: "KHOẢNG THỜI GIAN" },
    { id: "specific", label: "Ngày cụ thể", value: "NGÀY CỤ THỂ" },
  ]

  const handleSelect = (frequency: string) => {
    onSelect(frequency)
  }

  const handleConfirm = () => {
    onClose()
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={[styles.modalTitle, { fontFamily: fontFamily.medium }]}>Chọn tần suất</Text>
          
          {frequencies.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.optionItem}
              onPress={() => handleSelect(item.value)}
            >
              <Text
                style={[
                  styles.optionText,
                  { fontFamily: fontFamily.regular },
                  selectedFrequency === item.value && styles.selectedOptionText,
                ]}
              >
                {item.label}
              </Text>
              {selectedFrequency === item.value && (
                <Icon name="check-circle" size={24} color="#00BCD4" />
              )}
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
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
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalContent: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  selectedOptionText: {
    color: "#00BCD4",
  },
  confirmButton: {
    backgroundColor: "#00BCD4",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
  },
})

export default RepeatFrequencyModal