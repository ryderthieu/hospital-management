import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CheckboxWithLabel = ({ checked, onToggle, children }) => {
  return (
    <TouchableOpacity
      style={styles.checkboxContainer}
      onPress={onToggle}
      activeOpacity={0.8}
    >
      <Ionicons
        name={checked ? "checkbox" : "square-outline"}
        size={20}
        color={checked ? "#00B5B8" : "#8A8A8A"}
      />
      <Text style={styles.checkboxText}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkboxText: {
    fontSize: 14,
    color: "#2B2B2B",
    marginLeft: 8,
    flex: 1,
  },
});

export { CheckboxWithLabel };
