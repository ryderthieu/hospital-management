import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFont, fontFamily } from "../../context/FontContext";
const PageHeader = ({ title, subtitle, onBack }) => {
  const { fontsLoaded } = useFont();
  return (
    <>
      {onBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
      )}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  backButton: {
    marginTop: 20,
    marginBottom: 10,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    marginTop: 10,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontFamily: fontFamily.bold,
    color: "#2B2B2B",
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: "#8A8A8A",
  },
});

export { PageHeader };
