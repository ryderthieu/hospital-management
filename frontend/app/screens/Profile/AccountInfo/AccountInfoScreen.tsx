import type React from "react"
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { fontFamily } from "../../../context/FontContext"
import Header from "../../../components/Header"
import { mockUser } from "../Data"
import type { AccountInfoScreenNavigationProp } from "../../../navigation/types"

const AccountInfoScreen: React.FC = () => {
  const navigation = useNavigation<AccountInfoScreenNavigationProp>()

  // Info section component
  const InfoItem = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  )

  // Section component
  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  )

  const handleEditPress = () => {
    navigation.navigate("EditAccountInfo")
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Thông tin tài khoản"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showAction={true}
        actionType="edit"
        onActionPress={handleEditPress}
      />

      <ScrollView style={styles.scrollView}>
        {/* Personal Information Section */}
        <Section title="Thông tin cá nhân">
          <View style={styles.infoRow}>
            <InfoItem label="Mã bệnh nhân" value={mockUser.patientId || ""} />
            <InfoItem label="CCCD/CMND" value={mockUser.nationalId || ""} />
          </View>
          <View style={styles.infoRow}>
            <InfoItem label="Họ tên" value={mockUser.name} />
            <InfoItem label="Giới tính" value={mockUser.gender || ""} />
          </View>
          <View style={styles.infoRow}>
            <InfoItem label="Ngày sinh" value={mockUser.dob || ""} />
          </View>
        </Section>

        {/* Contact Information Section */}
        <Section title="Liên hệ">
          <View style={styles.infoRow}>
            <InfoItem label="Số điện thoại" value={mockUser.phone || ""} />
            <InfoItem label="Email" value={mockUser.email} />
          </View>
          <View style={styles.infoRow}>
            <InfoItem label="Tỉnh/Thành phố" value={mockUser.province || ""} />
            <InfoItem label="Quận/Huyện" value={mockUser.district || ""} />
          </View>
          <View style={styles.infoRow}>
            <InfoItem label="Xã/Phường" value={mockUser.ward || ""} />
          </View>
          <View style={styles.fullWidthItem}>
            <Text style={styles.infoLabel}>Địa chỉ</Text>
            <Text style={styles.infoValue}>{mockUser.fullAddress || ""}</Text>
          </View>
        </Section>

        {/* Emergency Contact Section */}
        <Section title="Liên hệ khẩn cấp">
          <View style={styles.infoRow}>
            <InfoItem label="Số điện thoại" value={mockUser.emergencyContact?.phone || ""} />
          </View>
          <View style={styles.infoRow}>
            <InfoItem label="Họ tên" value={mockUser.emergencyContact?.name || ""} />
          </View>
          <View style={styles.infoRow}>
            <InfoItem label="Mối quan hệ" value={mockUser.emergencyContact?.relationship || ""} />
          </View>
        </Section>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: fontFamily.medium,
    fontSize: 18,
    color: "#6B7280",
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  infoItem: {
    width: "48%",
  },
  fullWidthItem: {
    width: "100%",
    marginBottom: 16,
  },
  infoLabel: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  infoValue: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: "#111827",
  },
})

export default AccountInfoScreen
