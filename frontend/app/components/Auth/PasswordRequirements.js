import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PasswordRequirements = ({ password, show = false }) => {
  if (!show) return null;

  const hasEightChars = password.length >= 8;
  const hasNumber = /[0-9]/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);

  const requirements = [
    { met: hasEightChars, text: "Tối thiểu 8 ký tự" },
    { met: hasNumber, text: "Ít nhất 1 chữ số (từ 0 đến 9)" },
    { met: hasLetter, text: "Ít nhất 1 chữ cái viết thường hoặc viết hoa." },
  ];

  return (
    <View style={styles.requirementsContainer}>
      {requirements.map((req, index) => (
        <View key={index} style={styles.requirementRow}>
          <Ionicons
            name={req.met ? "checkmark-circle" : "close-circle"}
            size={18}
            color={req.met ? "#34C759" : "#FF3B30"}
          />
          <Text style={styles.requirementText}>{req.text}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  requirementsContainer: {
    marginTop: 20,
  },
  requirementRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  requirementText: {
    fontSize: 14,
    color: "#2B2B2B",
    marginLeft: 8,
    flex: 1,
  },
});

export { PasswordRequirements };
