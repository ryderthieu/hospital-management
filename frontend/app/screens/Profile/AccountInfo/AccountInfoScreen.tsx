// AccountInfoScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { fontFamily } from "../../../context/FontContext";
import Header from "../../../components/Header";
import API from "../../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

const AccountInfoScreen: React.FC = () => {
  const navigation = useNavigation<AccountInfoScreenNavigationProp>();
  const [patientData, setPatientData] = useState<PatientData | null>(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const patientId = await AsyncStorage.getItem('patientId');
        if (!patientId) {
          Alert.alert('Lỗi', 'Không tìm thấy patientId. Vui lòng đăng nhập lại.');
          return;
        }

        const response = await API.get<PatientData>(`/patients/${patientId}`);
        setPatientData(response.data);
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Không thể tải thông tin bệnh nhân. Vui lòng thử lại.';
        Alert.alert('Lỗi', errorMessage);
        console.error('Fetch patient error:', error.message, error.response?.data);
      }
    };

    fetchPatientData();
  }, []);

  // Info section component
  const InfoItem = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  // Section component
  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );

  const handleEditPress = () => {
    navigation.navigate("EditAccountInfo");
  };

  if (!patientData) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title="Thông tin tài khoản"
          showBack={true}
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.scrollView}>
          <Text>Đang tải dữ liệu...</Text>
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
            <InfoItem label="Mã bệnh nhân" value={patientData.patientId.toString()} />
            <InfoItem label="CCCD/CMND" value={patientData.identityNumber || ""} />
          </View>
          <View style={styles.infoRow}>
            <InfoItem label="Họ tên" value={patientData.fullName} />
            <InfoItem label="Giới tính" value={patientData.gender || ""} />
          </View>
          <View style={styles.infoRow}>
            <InfoItem label="Ngày sinh" value={patientData.birthday || ""} />
          </View>
        </Section>

        {/* Contact Information Section */}
        <Section title="Liên hệ">
          <View style={styles.infoRow}>
            <InfoItem label="Số điện thoại" value={patientData.phone || ""} />
            <InfoItem label="Email" value={patientData.email || ""} />
          </View>
          <View style={styles.infoRow}>
            <InfoItem label="Tỉnh/Thành phố" value={patientData.province || ""} />
            <InfoItem label="Quận/Huyện" value={patientData.district || ""} />
          </View>
          <View style={styles.infoRow}>
            <InfoItem label="Xã/Phường" value={patientData.ward || ""} />
          </View>
          <View style={styles.fullWidthItem}>
            <Text style={styles.infoLabel}>Địa chỉ</Text>
            <Text style={styles.infoValue}>{patientData.address || ""}</Text>
          </View>
        </Section>

        {/* Emergency Contact Section */}
        <Section title="Liên hệ khẩn cấp">
          {patientData.emergencyContactDtos?.length > 0 && (
            <>
              <View style={styles.infoRow}>
                <InfoItem label="Số điện thoại" value={patientData.emergencyContactDtos[0].phone || ""} />
              </View>
              <View style={styles.infoRow}>
                <InfoItem label="Họ tên" value={patientData.emergencyContactDtos[0].name || ""} />
              </View>
              <View style={styles.infoRow}>
                <InfoItem label="Mối quan hệ" value={patientData.emergencyContactDtos[0].relationship || ""} />
              </View>
            </>
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
});

export default AccountInfoScreen;