import type React from "react"
import { View, StyleSheet } from "react-native"
import { colors } from "../../styles/globalStyles"

interface CheckboxProps {
  status: "pending" | "taken" | "canceled"
}

const Checkbox: React.FC<CheckboxProps> = ({ status }) => {
  return (
    <View style={styles.container}>
      {status === "pending" && <View style={styles.pendingCheckbox} />}

      {status === "taken" && (
        <View style={styles.takenCheckbox}>
          <View style={styles.checkmark}>
            <View style={styles.checkmarkLine1} />
            <View style={styles.checkmarkLine2} />
          </View>
        </View>
      )}

      {status === "canceled" && (
        <View style={styles.canceledCheckbox}>
          <View style={styles.cross}>
            <View style={styles.crossLine1} />
            <View style={styles.crossLine2} />
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
  pendingCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#CCCCCC",
    backgroundColor: "white",
  },
  takenCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: colors.base500,
    justifyContent: "center",
    alignItems: "center",
  },
  canceledCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: "#FF5252",
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    width: 12,
    height: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkLine1: {
    position: "absolute",
    width: 4,
    height: 2,
    backgroundColor: "white",
    bottom: 4,
    left: 1,
    transform: [{ rotate: "45deg" }],
  },
  checkmarkLine2: {
    position: "absolute",
    width: 8,
    height: 2,
    backgroundColor: "white",
    bottom: 5,
    right: 1,
    transform: [{ rotate: "-45deg" }],
  },
  cross: {
    width: 12,
    height: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  crossLine1: {
    position: "absolute",
    width: 10,
    height: 2,
    backgroundColor: "white",
    transform: [{ rotate: "45deg" }],
  },
  crossLine2: {
    position: "absolute",
    width: 10,
    height: 2,
    backgroundColor: "white",
    transform: [{ rotate: "-45deg" }],
  },
})

export default Checkbox
