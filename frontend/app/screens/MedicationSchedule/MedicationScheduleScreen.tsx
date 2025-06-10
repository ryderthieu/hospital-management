"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { fontFamily } from "../../context/FontContext"
import Header from "../../components/Header"
import { colors } from "../../styles/globalStyles"
import API from "../../services/api"
import type { MedicationScheduleStackParamList } from "../../navigation/types"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"

type NavigationProp = NativeStackNavigationProp<MedicationScheduleStackParamList>

interface Prescription {
  prescriptionId: number;
  appointmentId: number;
  patientId: number;
  diagnosis: string;
  note: string;
  createdAt: string;
  bloodSugar: number;
  heartRate: number;
  systolicBloodPressure: number;
  diastolicBloodPressure: number;
  followUp: boolean;
  followUpDate: string;
  prescriptionDetails: Array<{
    medicineId: number;
    medicineName: string;
    quantity: number;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
}

interface Patient {
  patientId: number;
  fullName: string;
}

const MedicationScheduleScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>()
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [patient, setPatient] = useState<Patient | null>(null)

  const getPatientInfo = async () => {
    try {
      const patientJson = await AsyncStorage.getItem('patient')
      if (patientJson) {
        const patientData = JSON.parse(patientJson)
        setPatient(patientData)
        return patientData
      }
      return null
    } catch (err) {
      console.error('Lỗi khi lấy thông tin bệnh nhân:', err)
      return null
    }
  }

  const fetchPrescriptions = async () => {
    try {
      setLoading(true)
      console.log('Đang lấy thông tin bệnh nhân...')
      const patientData = await getPatientInfo()
      if (!patientData?.patientId) {
        throw new Error('Không tìm thấy thông tin bệnh nhân')
      }
      
      console.log('Đang gọi API lấy danh sách đơn thuốc...')
      const response = await API.get(`/pharmacy/prescriptions/patient/${patientData.patientId}`)
      console.log('Kết quả API:', response.data)
      setPrescriptions(response.data)
      setError("")
    } catch (err: any) {
      console.error('Chi tiết lỗi:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        config: err.config
      })
      setError(err.message || "Không thể tải danh sách đơn thuốc")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrescriptions()
  }, [])

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Đơn thuốc" />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary || '#007AFF'} />
          <Text style={styles.loadingText}>Đang tải đơn thuốc...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Đơn thuốc" />
        <View style={styles.centerContainer}>
          <Ionicons name="warning-outline" size={48} color="#FF3B30" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchPrescriptions}
          >
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  if (prescriptions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Đơn thuốc" />
        <View style={styles.centerContainer}>
          <Ionicons name="document-text-outline" size={48} color="#8E8E93" />
          <Text style={styles.emptyText}>Bạn chưa có đơn thuốc nào</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Đơn thuốc"
        showBack={false}
        showAction={true}
        actionType="notification"
        onActionPress={() => navigation.navigate("Notifications")}
      />
      <FlatList
        data={prescriptions}
        keyExtractor={(item) => item.prescriptionId.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.prescriptionCard}
            onPress={() => navigation.navigate('PrescriptionDetail', { prescriptionId: item.prescriptionId.toString() })}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FFFFFF', '#F8FAFC']}
              style={styles.cardGradient}
            >
              <View style={styles.cardContent}>
                <View style={styles.prescriptionHeader}>
                  <View style={styles.titleContainer}>
                    <Ionicons name="medkit-outline" size={24} color={colors.primary || '#007AFF'} />
                    <Text style={styles.prescriptionTitle}>Đơn thuốc #{item.prescriptionId}</Text>
                  </View>
                  <Text style={styles.prescriptionDate}>
                    {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                  </Text>
                </View>
                <View style={styles.divider} />
                <Text style={styles.prescriptionDiagnosis}>Chẩn đoán: {item.diagnosis}</Text>
                <Text style={styles.prescriptionNote} numberOfLines={2}>
                  Ghi chú: {item.note || 'Không có'}
                </Text>
                <View style={styles.statusContainer}>
                  <Ionicons
                    name={item.followUp ? "calendar-outline" : "close-circle-outline"}
                    size={16}
                    color={item.followUp ? '#10B981' : '#FF3B30'}
                  />
                  <Text style={styles.prescriptionStatus}>
                    Tái khám: {item.followUp ? `Ngày ${new Date(item.followUpDate).toLocaleDateString('vi-VN')}` : 'Không'}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  listContainer: {
    paddingVertical: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text || '#000000',
    fontFamily: fontFamily.regular,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    marginTop: 12,
    marginBottom: 24,
    fontFamily: fontFamily.regular,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    fontFamily: fontFamily.regular,
    marginTop: 12,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.primary || '#007AFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: fontFamily.medium,
  },
  prescriptionCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
    transform: [{ scale: 1 }],
  },
  cardGradient: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardContent: {
    flex: 1,
  },
  prescriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  prescriptionTitle: {
    fontSize: 20,
    fontFamily: fontFamily.bold,
    color: colors.text || '#000000',
  },
  prescriptionDate: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: '#6B7280',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  prescriptionDiagnosis: {
    fontSize: 16,
    fontFamily: fontFamily.medium,
    color: colors.text || '#000000',
    marginBottom: 8,
  },
  prescriptionNote: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: '#4B5563',
    marginBottom: 8,
    lineHeight: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  prescriptionStatus: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: '#6B7280',
  },
})

export default MedicationScheduleScreen