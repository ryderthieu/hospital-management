"use client"

import type React from "react"
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native"
import { fontFamily } from "../../../context/FontContext"

interface DeleteReminderModalProps {
  visible: boolean
  onClose: () => void
  onConfirm: () => void
}

const { width: screenWidth } = Dimensions.get("window")

const DeleteReminderModal: React.FC<DeleteReminderModalProps> = ({ visible, onClose, onConfirm }) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={[styles.title, { fontFamily: fontFamily.medium }]}>Xác nhận</Text>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={[styles.cancelButtonText, { fontFamily: fontFamily.regular }]}>Hủy</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={[styles.message, { fontFamily: fontFamily.regular }]}>
              Bạn có chắc chắn muốn xóa lịch nhắc này không?
            </Text>
          </View>

          <TouchableOpacity style={styles.deleteButton} onPress={onConfirm}>
            <Text style={[styles.deleteButtonText, { fontFamily: fontFamily.medium }]}>Xóa</Text>
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    position: "relative",
  },
  title: {
    fontSize: 18,
    color: "#333",
    fontWeight: "600",
  },
  cancelButton: {
    position: "absolute",
    right: 0,
    padding: 5,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#999",
  },
  content: {
    alignItems: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  message: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    lineHeight: 24,
  },
  deleteButton: {
    backgroundColor: "#E53935",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default DeleteReminderModal
