import type React from "react"
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native"
import { colors } from "../../styles/globalStyles"
import type { Medication } from "../../screens/MedicationSchedule/type"

interface MedicationConfirmModalProps {
  visible: boolean
  medication: Medication | null
  onClose: () => void
  onConfirm: () => void
  onCancel: () => void
  onAdjust: () => void
}

const MedicationConfirmModal: React.FC<MedicationConfirmModalProps> = ({
  visible,
  medication,
  onClose,
  onConfirm,
  onCancel,
  onAdjust,
}) => {
  if (!medication) return null

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Xác nhận uống thuốc</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Hủy</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.medicationInfo}>
            <Text style={styles.medicationName}>{medication.name}</Text>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{medication.time}</Text>
              <Text style={styles.dosageText}> - {medication.dosage}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButtonContainer} onPress={onCancel}>
              <View style={[styles.actionButton, styles.cancelButton]}>
                <View style={styles.crossIcon}>
                  <View style={styles.crossLine1} />
                  <View style={styles.crossLine2} />
                </View>
              </View>
              <Text style={styles.actionButtonText}>Hủy dùng thuốc</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButtonContainer} onPress={onConfirm}>
              <View style={[styles.actionButton, styles.confirmButton]}>
                <View style={styles.checkmarkIcon}>
                  <View style={styles.checkmarkLine1} />
                  <View style={styles.checkmarkLine2} />
                </View>
              </View>
              <Text style={styles.actionButtonText}>Dùng thuốc</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButtonContainer} onPress={onAdjust}>
              <View style={[styles.actionButton, styles.adjustButton]}>
                <View style={styles.editIcon}>
                  <View style={styles.editCircle} />
                  <View style={styles.editLine1} />
                  <View style={styles.editLine2} />
                  <View style={styles.editLine3} />
                </View>
              </View>
              <Text style={styles.actionButtonText}>Điều chỉnh</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={onConfirm}>
            <Text style={styles.saveButtonText}>Lưu</Text>
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
    padding: 20,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 16,
    color: "#999",
  },
  medicationInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  medicationName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.base500,
  },
  dosageText: {
    fontSize: 16,
    color: "#666",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: 20,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  actionButtonContainer: {
    alignItems: "center",
    flex: 1,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  cancelButton: {
    backgroundColor: "#FFD6D6",
  },
  confirmButton: {
    backgroundColor: "#D6F5F5",
  },
  adjustButton: {
    backgroundColor: "#E5E5E5",
  },
  actionButtonText: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
    fontWeight: "500",
  },
  saveButton: {
    backgroundColor: colors.base500,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  // Cross icon styles (Cancel)
  crossIcon: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  crossLine1: {
    position: "absolute",
    width: 16,
    height: 2.5,
    backgroundColor: "#FF5252",
    borderRadius: 1.25,
    transform: [{ rotate: "45deg" }],
  },
  crossLine2: {
    position: "absolute",
    width: 16,
    height: 2.5,
    backgroundColor: "#FF5252",
    borderRadius: 1.25,
    transform: [{ rotate: "-45deg" }],
  },

  // Checkmark icon styles (Confirm)
  checkmarkIcon: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkLine1: {
    position: "absolute",
    width: 6,
    height: 2.5,
    backgroundColor: colors.base500,
    borderRadius: 1.25,
    bottom: 6,
    left: 3,
    transform: [{ rotate: "45deg" }],
  },
  checkmarkLine2: {
    position: "absolute",
    width: 12,
    height: 2.5,
    backgroundColor: colors.base500,
    borderRadius: 1.25,
    bottom: 8,
    right: 2,
    transform: [{ rotate: "-45deg" }],
  },

  // Edit icon styles (Adjust)
  editIcon: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  editCircle: {
    position: "absolute",
    width: 4,
    height: 4,
    backgroundColor: "#666",
    borderRadius: 2,
    top: 2,
    right: 2,
  },
  editLine1: {
    position: "absolute",
    width: 12,
    height: 2,
    backgroundColor: "#666",
    borderRadius: 1,
    top: 8,
    left: 4,
  },
  editLine2: {
    position: "absolute",
    width: 10,
    height: 2,
    backgroundColor: "#666",
    borderRadius: 1,
    top: 12,
    left: 4,
  },
  editLine3: {
    position: "absolute",
    width: 8,
    height: 2,
    backgroundColor: "#666",
    borderRadius: 1,
    top: 16,
    left: 4,
  },
})

export default MedicationConfirmModal
