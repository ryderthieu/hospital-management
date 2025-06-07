"use client"

import type React from "react"
import { useState } from "react"
import { SafeAreaView, StyleSheet, View, TouchableOpacity, Text, StatusBar } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { fontFamily } from "../../../context/FontContext"
import Header from "../../../components/Header"
import DailyReminderScreen from "./DailyReminderScreen"
import CustomReminderScreen from "./CustomReminderScreen"

const MedicationReminderScreen: React.FC = () => {
  const navigation = useNavigation()
  const [activeTab, setActiveTab] = useState<"daily" | "custom">("daily")

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header title="Lịch nhắc thuốc" showBack={true} onBackPress={() => navigation.goBack()} />
      
      <View style={styles.content}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "daily" && styles.activeTab]}
            onPress={() => setActiveTab("daily")}
          >
            <Text
              style={[
                styles.tabText, 
                { fontFamily: fontFamily.medium }, 
                activeTab === "daily" && styles.activeTabText
              ]}
            >
              Hàng ngày
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "custom" && styles.activeTab]}
            onPress={() => setActiveTab("custom")}
          >
            <Text
              style={[
                styles.tabText, 
                { fontFamily: fontFamily.medium }, 
                activeTab === "custom" && styles.activeTabText
              ]}
            >
              Tùy chỉnh
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "daily" ? <DailyReminderScreen /> : <CustomReminderScreen />}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#E5E5E5",
    borderRadius: 25,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    color: "#666",
  },
  activeTabText: {
    color: "#333",
  },
})

export default MedicationReminderScreen