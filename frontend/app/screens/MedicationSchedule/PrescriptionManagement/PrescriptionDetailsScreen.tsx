"use client"

import type React from "react"
import { useState } from "react"
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ScrollView, StatusBar } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { fontFamily } from "../../../context/FontContext"
import Header from "../../../components/Header"
import { colors } from "../../../styles/globalStyles"
import type { PrescriptionDetail, MedicationDetail } from "../type"

// Sample data - single prescription object with more medications
const samplePrescriptionDetail = {
  id: "1",
  specialty: "Tim mạch - Đa khoa",
  code: "TM240001",
  medications: [
    // Thuốc đã đặt lịch
    {
      id: "med_001",
      name: "Ambroxol HCl (Medovent 30mg)",
      route: "Uống",
      timesPerDay: 3,
      quantityPerDay: 1,
      timeOfUse: "Sáng, trưa, chiều",
      isScheduled: true,
      hasReminder: true,
    },
    {
      id: "med_002",
      name: "Vitamin C 500mg",
      route: "Uống",
      timesPerDay: 2,
      quantityPerDay: 2,
      timeOfUse: "Sau ăn sáng và tối",
      isScheduled: true,
      hasReminder: true,
    },
    {
      id: "med_003",
      name: "Amlodipine 5mg",
      route: "Uống",
      timesPerDay: 1,
      quantityPerDay: 1,
      timeOfUse: "Buổi sáng, lúc đói",
      isScheduled: true,
      hasReminder: true,
    },
    {
      id: "med_004",
      name: "Losartan 50mg",
      route: "Uống",
      timesPerDay: 1,
      quantityPerDay: 1,
      timeOfUse: "Buổi tối, lúc đói",
      isScheduled: true,
      hasReminder: true,
    },
    {
      id: "med_005",
      name: "Omeprazole 20mg",
      route: "Uống",
      timesPerDay: 1,
      quantityPerDay: 1,
      timeOfUse: "Trước ăn sáng 30 phút",
      isScheduled: true,
      hasReminder: true,
    },
    // Thuốc chưa đặt lịch
    {
      id: "med_006",
      name: "Paracetamol 500mg",
      route: "Uống",
      timesPerDay: 3,
      quantityPerDay: 3,
      timeOfUse: "Sau ăn 30 phút",
      isScheduled: false,
      hasReminder: false,
    },
    {
      id: "med_007",
      name: "Cephalexin 250mg",
      route: "Uống",
      timesPerDay: 4,
      quantityPerDay: 4,
      timeOfUse: "Cách nhau 6 tiếng",
      isScheduled: false,
      hasReminder: false,
    },
    {
      id: "med_008",
      name: "Aspirin 100mg",
      route: "Uống",
      timesPerDay: 1,
      quantityPerDay: 1,
      timeOfUse: "Sau ăn tối",
      isScheduled: false,
      hasReminder: false,
    },
    {
      id: "med_009",
      name: "Metformin 500mg",
      route: "Uống",
      timesPerDay: 2,
      quantityPerDay: 2,
      timeOfUse: "Sau ăn sáng và tối",
      isScheduled: false,
      hasReminder: false,
    },
    {
      id: "med_010",
      name: "Simvastatin 20mg",
      route: "Uống",
      timesPerDay: 1,
      quantityPerDay: 1,
      timeOfUse: "Trước khi đi ngủ",
      isScheduled: false,
      hasReminder: false,
    },
    {
      id: "med_011",
      name: "Dextromethorphan 15mg",
      route: "Uống",
      timesPerDay: 3,
      quantityPerDay: 1,
      timeOfUse: "Khi ho, cách nhau ít nhất 4 tiếng",
      isScheduled: false,
      hasReminder: false,
    },
    {
      id: "med_012",
      name: "Loratadine 10mg",
      route: "Uống",
      timesPerDay: 1,
      quantityPerDay: 1,
      timeOfUse: "Buổi tối trước khi ngủ",
      isScheduled: false,
      hasReminder: false,
    },
  ],
}

const PrescriptionDetailsScreen: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute()

  // Fixed: Using a single prescription object instead of array
  const [prescriptionDetail] = useState(samplePrescriptionDetail)
  const [activeTab, setActiveTab] = useState<"unscheduled" | "scheduled">("scheduled")
  
  // These will now work correctly since prescriptionDetail.medications exists
  const unscheduledMedications = prescriptionDetail.medications.filter((med) => !med.isScheduled)
  const scheduledMedications = prescriptionDetail.medications.filter((med) => med.isScheduled)

  // Add this function to handle the reminder button press
  const handleSetReminder = (medicationId: string) => {
    // Navigate to the medication reminder screen
    navigation.navigate("MedicationReminder", { medicationId })
  }

  const renderMedicationItem = (medication: MedicationDetail) => (
    <View key={medication.id} style={styles.medicationContainer}>
      <View style={styles.medicationHeader}>
        <View style={styles.medicationIcon}>
          <View style={styles.pillIcon}>
            <View style={styles.pillLeft} />
            <View style={styles.pillRight} />
          </View>
        </View>
        <Text style={[styles.medicationName, { fontFamily: fontFamily.medium }]}>{medication.name}</Text>
      </View>

      <View style={styles.medicationDetails}>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { fontFamily: fontFamily.regular }]}>Đường dùng:</Text>
          <Text style={[styles.detailValue, { fontFamily: fontFamily.medium }]}>{medication.route}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { fontFamily: fontFamily.regular }]}>Lần/ngày:</Text>
          <Text style={[styles.detailValue, { fontFamily: fontFamily.medium }]}>{medication.timesPerDay}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { fontFamily: fontFamily.regular }]}>Số lượng/ngày:</Text>
          <Text style={[styles.detailValue, { fontFamily: fontFamily.medium }]}>{medication.quantityPerDay}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { fontFamily: fontFamily.regular }]}>Buổi dùng:</Text>
          <Text style={[styles.detailValue, { fontFamily: fontFamily.medium }]}>{medication.timeOfUse}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.reminderButton} onPress={() => handleSetReminder(medication.id)}>
        {medication.hasReminder ? (
          // Bell icon for medications with reminders
          <View style={styles.bellIcon}>
            <View style={styles.bellBody} />
            <View style={styles.bellHandle} />
            <View style={styles.bellClapper} />
          </View>
        ) : (
          // Bell with slash icon for medications without reminders
          <View style={styles.bellSlashIcon}>
            <View style={styles.bellBody} />
            <View style={styles.bellHandle} />
            <View style={styles.bellSlash} />
          </View>
        )}
        <Text style={[styles.reminderButtonText, { fontFamily: fontFamily.medium }]}>
          {medication.hasReminder ? "Đã đặt lịch nhắc" : "Đặt lịch nhắc"}
        </Text>
      </TouchableOpacity>

      {/* Only add divider if it's not the last item */}
      {activeTab === "scheduled" && scheduledMedications.length > 0 &&
        medication.id !== scheduledMedications[scheduledMedications.length - 1].id && (
          <View style={styles.dottedDivider} />
        )}
      {activeTab === "unscheduled" && unscheduledMedications.length > 0 &&
        medication.id !== unscheduledMedications[unscheduledMedications.length - 1].id && (
          <View style={styles.dottedDivider} />
        )}
    </View>
  )

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Text style={[styles.emptyStateText, { fontFamily: fontFamily.medium }]}>
        Tất cả thuốc trong toa đã được đặt lịch thành công
      </Text>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Header title="Chi tiết đơn thuốc" showBack={true} onBackPress={() => navigation.goBack()} />

      <View style={styles.content}>
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "unscheduled" && styles.activeTab]}
            onPress={() => setActiveTab("unscheduled")}
          >
            <Text
              style={[
                styles.tabText,
                { fontFamily: fontFamily.medium },
                activeTab === "unscheduled" && styles.activeTabText,
              ]}
            >
              Chưa đặt lịch ({unscheduledMedications.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "scheduled" && styles.activeTab]}
            onPress={() => setActiveTab("scheduled")}
          >
            <Text
              style={[
                styles.tabText,
                { fontFamily: fontFamily.medium },
                activeTab === "scheduled" && styles.activeTabText,
              ]}
            >
              Đã đặt lịch ({scheduledMedications.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Prescription Info Card */}
        <View style={styles.prescriptionCard}>
          <View style={styles.prescriptionInfo}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { fontFamily: fontFamily.regular }]}>Đơn thuốc:</Text>
              <Text style={[styles.infoValue, { fontFamily: fontFamily.medium }]}>{prescriptionDetail.specialty}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { fontFamily: fontFamily.regular }]}>Mã đơn thuốc:</Text>
              <Text style={[styles.infoValue, { fontFamily: fontFamily.medium }]}>{prescriptionDetail.code}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Medications List or Empty State */}
          {activeTab === "unscheduled" && unscheduledMedications.length === 0 ? (
            renderEmptyState()
          ) : (
            <ScrollView style={styles.medicationsList} showsVerticalScrollIndicator={false}>
              {activeTab === "unscheduled"
                ? unscheduledMedications.map(renderMedicationItem)
                : scheduledMedications.map(renderMedicationItem)}
            </ScrollView>
          )}
        </View>
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
  prescriptionCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  prescriptionInfo: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    width: 120,
  },
  infoValue: {
    fontSize: 14,
    color: colors.base500,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginBottom: 16,
  },
  medicationsList: {
    flex: 1,
  },
  medicationContainer: {
    marginBottom: 12,
  },
  medicationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  medicationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  pillIcon: {
    flexDirection: "row",
    width: 20,
    height: 12,
  },
  pillLeft: {
    width: 10,
    height: 12,
    backgroundColor: colors.base500,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  pillRight: {
    width: 10,
    height: 12,
    backgroundColor: "#81C784",
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  medicationName: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  medicationDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    width: 120,
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  reminderButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E6F7F7",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  bellIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
    position: "relative",
  },
  bellBody: {
    position: "absolute",
    bottom: 2,
    left: 2,
    right: 2,
    height: 12,
    backgroundColor: colors.base500,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  bellHandle: {
    position: "absolute",
    top: 0,
    left: 6,
    right: 6,
    height: 4,
    backgroundColor: colors.base500,
    borderRadius: 2,
  },
  bellClapper: {
    position: "absolute",
    bottom: 0,
    left: 7,
    width: 2,
    height: 2,
    backgroundColor: colors.base500,
    borderRadius: 1,
  },
  bellSlashIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
    position: "relative",
  },
  bellSlash: {
    position: "absolute",
    top: 6,
    left: -2,
    width: 20,
    height: 2,
    backgroundColor: "#FF5252",
    borderRadius: 1,
    transform: [{ rotate: "45deg" }],
    zIndex: 1,
  },
  reminderButtonText: {
    fontSize: 14,
    color: colors.base500,
  },
  dottedDivider: {
    height: 1,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginVertical: 8,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#4CAF50",
    textAlign: "center",
    lineHeight: 24,
  },
})

export default PrescriptionDetailsScreen