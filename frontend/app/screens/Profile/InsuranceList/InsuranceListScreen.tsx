"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Image } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { fontFamily } from "../../../context/FontContext"
import Header from "../../../components/Header"
import { mockInsurances } from "../Data"
import type { Insurance } from "../type"

const InsuranceListScreen: React.FC = () => {
  const navigation = useNavigation()
  const [insurances] = useState<Insurance[]>(mockInsurances)

  const renderInsuranceItem = ({ item }: { item: Insurance }) => {
    const handlePress = () => {
      navigation.navigate("InsuranceDetail" as never, { insurance: item } as never)
    }

    return (
      <TouchableOpacity style={styles.insuranceCard} onPress={handlePress} activeOpacity={0.7}>
        <View style={styles.cardContent}>
          <View style={styles.insuranceIconContainer}>
            {item.type === "BHYT" ? (
              <Image source={require("../../../assets/images/logo/Logo.png")} style={styles.insuranceIcon} />
            ) : (
              <Ionicons name="shield-checkmark" size={32} color="#4285F4" />
            )}
          </View>
          <View style={styles.insuranceInfo}>
            <Text style={styles.insuranceName}>{item.name}</Text>
            <Text style={styles.insuranceNumber}>{item.policyNumber}</Text>
          </View>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: item.isActive ? "rgba(11, 197, 197, 0.1)" : "rgba(239, 68, 68, 0.1)" },
              ]}
            >
              <Text style={[styles.statusText, { color: item.isActive ? "#0BC5C5" : "#EF4444" }]}>
                {item.isActive ? "Còn hạn" : "Hết hạn"}
              </Text>
            </View>
            {item.class && (
              <View style={styles.classBadge}>
                <Text style={styles.classText}>Class {item.class}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Danh sách bảo hiểm"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showAction={true}
        actionType="add"
        onActionPress={() => navigation.navigate("AddInsurance" as never)}
      />

      <View style={styles.content}>
        {insurances.length > 0 ? (
          <FlatList
            data={insurances}
            renderItem={renderInsuranceItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="shield-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyText}>Bạn chưa có bảo hiểm nào</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddInsurance" as never)}>
              <Text style={styles.addButtonText}>Thêm bảo hiểm</Text>
            </TouchableOpacity>
          </View>
        )}
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
  listContainer: {
    paddingBottom: 16,
  },
  insuranceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    overflow: "hidden",
  },
  cardContent: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  insuranceIconContainer: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  insuranceIcon: {
    width: 48,
    height: 48,
    resizeMode: "contain",
  },
  insuranceInfo: {
    flex: 1,
    marginLeft: 12,
  },
  insuranceName: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: "#111827",
    marginBottom: 4,
  },
  insuranceNumber: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: "#6B7280",
  },
  statusContainer: {
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
  },
  classBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "rgba(66, 133, 244, 0.1)",
  },
  classText: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    color: "#4285F4",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: "#6B7280",
    marginTop: 16,
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: "#0BC5C5",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: "#FFFFFF",
  },
})

export default InsuranceListScreen
