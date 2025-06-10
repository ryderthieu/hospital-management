import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { fontFamily } from "../../../context/FontContext";
import { useAuth } from "../../../context/AuthContext";
import Header from "../../../components/Header";
import type { AccountInfoScreenNavigationProp } from "../../../navigation/types";

interface PatientData {
  patientId: number;
  identityNumber: string;
  fullName: string;
  gender: string;
  birthday: string;
  phone: string;
  email: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  emergencyContactDtos: { phone: string; name: string; relationship: string }[];
}

interface UserData {
  userId: number;
  phone: string;
  email: string;
}

const AccountInfoScreen: React.FC = () => {
  const navigation = useNavigation<AccountInfoScreenNavigationProp>();
  const { patient, user } = useAuth();

  // Info section component
  const InfoItem = ({
    label,
    value,
  }: {
    label: string;
    value: string | null | undefined;
  }) => (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, !value && styles.placeholderText]}>
        {value || "Chưa cập nhật"}
      </Text>
    </View>
  );

  // Section component
  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );

  const handleEditPress = () => {
    navigation.navigate("EditAccountInfo");
  };

  if (!patient || !user) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title="Thông tin tài khoản"
          showBack={true}
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.scrollView}>
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      </SafeAreaView>
    );
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
            <InfoItem
              label="Mã bệnh nhân"
              value={patient.patientId.toString()}
            />
            <InfoItem label="CCCD/CMND" value={patient.identityNumber} />
          </View>
          <View style={styles.infoRow}>
            <InfoItem label="Họ tên" value={patient.fullName} />
            <InfoItem label="Giới tính" value={patient.gender} />
          </View>
          <View style={styles.infoRow}>
            <InfoItem label="Ngày sinh" value={patient.birthday} />
          </View>
        </Section>

        {/* Contact Information Section */}
        <Section title="Liên hệ">
          <View style={styles.infoRow}>
            <InfoItem label="Số điện thoại" value={user.phone} />
            <InfoItem label="Email" value={patient.email} />
          </View>
          <View style={styles.fullWidthItem}>
            <Text style={styles.infoLabel}>Địa chỉ</Text>
            <Text
              style={[
                styles.infoValue,
                !patient.address && styles.placeholderText,
              ]}
            >
              {patient.address || "Chưa cập nhật"}
            </Text>
          </View>
        </Section>

        {/* Emergency Contact Section */}
        <Section title="Liên hệ khẩn cấp">
          {patient.emergencyContactDtos?.length > 0 ? (
            patient.emergencyContactDtos.map((contact, index) => (
              <View key={contact.contactId || index}>
                <View style={styles.infoRow}>
                  <InfoItem label="Số điện thoại" value={contact.phone} />
                </View>
                <View style={styles.infoRow}>
                  <InfoItem label="Họ tên" value={contact.name} />
                </View>
                <View style={styles.infoRow}>
                  <InfoItem label="Mối quan hệ" value={contact.relationship} />
                </View>
                {index < patient.emergencyContactDtos.length - 1 && (
                  <View style={styles.separator} />
                )}
              </View>
            ))
          ) : (
            <Text style={styles.placeholderText}>
              Chưa có thông tin liên hệ khẩn cấp
            </Text>
          )}
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollView: {
    flex: 1,
    padding: 20, // Tăng padding
  },
  section: {
    marginBottom: 32, // Tăng khoảng cách giữa các section
  },
  sectionTitle: {
    fontFamily: fontFamily.medium,
    fontSize: 18,
    color: "#6B7280",
    marginBottom: 16,
  },
  separator: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 10,
  },
  sectionContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20, // Tăng padding trong section
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20, // Tăng khoảng cách giữa các hàng
  },
  infoItem: {
    width: "48%",
  },
  fullWidthItem: {
    width: "100%",
    marginBottom: 20,
  },
  infoLabel: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 8,
  },
  infoValue: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: "#111827",
  },
  placeholderText: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
  loadingText: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 20,
  },
});

export default AccountInfoScreen;
