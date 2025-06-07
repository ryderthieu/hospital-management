import type React from "react"
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image } from "react-native"
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { fontFamily } from "../../../context/FontContext"
import Header from "../../../components/Header"
import type { ProfileStackParamList } from "../../../navigation/types"

type InsuranceDetailScreenRouteProp = RouteProp<ProfileStackParamList, "InsuranceDetail">

const InsuranceDetailScreen: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute<InsuranceDetailScreenRouteProp>()
  const { insurance } = route.params

  const handleEdit = () => {
    navigation.navigate("EditInsurance" as never, { insurance } as never)
  }

  // Format date from YYYY-MM-DD to DD/MM/YYYY
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    return dateString
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={insurance.type === "BHYT" ? "Chi tiết BHYT" : "Chi tiết bảo hiểm"}
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showAction={true}
        actionType="edit"
        onActionPress={handleEdit}
      />

      <ScrollView style={styles.scrollView}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.insuranceName}>{insurance.name}</Text>
            {insurance.class && (
              <View style={styles.classBadge}>
                <Text style={styles.classText}>Class {insurance.class}</Text>
              </View>
            )}
          </View>

          <View style={styles.cardContent}>
            {insurance.type === "BHYT" ? (
              <Image source={require("../../../assets/images/logo/Logo.png")} style={styles.insuranceIcon} />
            ) : (
              <View style={styles.otherInsuranceIcon}>
                <Ionicons name="shield-checkmark" size={48} color="#4285F4" />
              </View>
            )}

            <View style={styles.userInfo}>
              <Text style={styles.userName}>{insurance.holderName}</Text>
              <Text style={styles.policyNumber}>{insurance.policyNumber}</Text>
            </View>
          </View>
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Nhà cung cấp</Text>
            <Text style={styles.detailValue}>{insurance.provider}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Loại bảo hiểm</Text>
            <Text style={styles.detailValue}>{insurance.coverageType}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Ngày hiệu lực</Text>
            <Text style={styles.detailValue}>{insurance.startDate || "N/A"}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Ngày hết hạn</Text>
            <Text style={styles.detailValue}>{formatDate(insurance.expiryDate)}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Trạng thái</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: insurance.isActive ? "rgba(11, 197, 197, 0.1)" : "rgba(239, 68, 68, 0.1)" },
              ]}
            >
              <Text style={[styles.statusText, { color: insurance.isActive ? "#0BC5C5" : "#EF4444" }]}>
                {insurance.isActive ? "Còn hạn" : "Hết hạn"}
              </Text>
            </View>
          </View>
        </View>

        {insurance.benefits && insurance.benefits.length > 0 && (
          <View style={styles.benefitsCard}>
            <Text style={styles.benefitsTitle}>Quyền lợi bảo hiểm</Text>
            {insurance.benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={20} color="#0BC5C5" style={styles.benefitIcon} />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>
        )}

        {insurance.type === "BHYT" && (
          <TouchableOpacity style={styles.qrButton}>
            <Ionicons name="qr-code" size={20} color="#FFFFFF" />
            <Text style={styles.qrButtonText}>Hiển thị mã QR</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  insuranceName: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
    color: "#111827",
  },
  classBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "rgba(66, 133, 244, 0.1)",
  },
  classText: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: "#4285F4",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  insuranceIcon: {
    width: 64,
    height: 64,
    resizeMode: "contain",
  },
  otherInsuranceIcon: {
    width: 64,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
  },
  userInfo: {
    marginLeft: 16,
  },
  userName: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: "#111827",
    marginBottom: 4,
  },
  policyNumber: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: "#6B7280",
  },
  detailsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  detailLabel: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: "#6B7280",
  },
  detailValue: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: "#111827",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
  },
  benefitsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  benefitsTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: "#111827",
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  benefitIcon: {
    marginRight: 8,
  },
  benefitText: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: "#4B5563",
    flex: 1,
  },
  qrButton: {
    backgroundColor: "#0BC5C5",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  qrButtonText: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: "#FFFFFF",
    marginLeft: 8,
  },
})

export default InsuranceDetailScreen
