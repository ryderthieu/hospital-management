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
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { fontFamily } from "../../context/FontContext"
import Header from "../../components/Header"
import { colors } from "../../styles/globalStyles"
import API from "../../services/api"
import type { MedicationScheduleStackParamList } from "../../navigation/types"
import AsyncStorage from "@react-native-async-storage/async-storage"

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
          <Text>Đang tải...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Đơn thuốc" />
        <View style={styles.centerContainer}>
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
          <Text style={styles.emptyText}>Bạn chưa có đơn thuốc nào</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Đơn thuốc" />
      <FlatList
        data={prescriptions}
        keyExtractor={(item) => item.prescriptionId.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.prescriptionCard}
            onPress={() => navigation.navigate('PrescriptionDetail', { prescriptionId: item.prescriptionId.toString() })}
          >
            <View style={styles.prescriptionHeader}>
              <Text style={styles.prescriptionTitle}>Đơn thuốc #{item.prescriptionId}</Text>
              <Text style={styles.prescriptionDate}>
                {new Date(item.createdAt).toLocaleDateString('vi-VN')}
              </Text>
            </View>
            <Text style={styles.prescriptionDiagnosis}>Chẩn đoán: {item.diagnosis}</Text>
            <Text style={styles.prescriptionNote} numberOfLines={2}>
              Ghi chú: {item.note || 'Không có'}
            </Text>
            <Text style={styles.prescriptionStatus}>
              Tái khám: {item.followUp ? `Ngày ${new Date(item.followUpDate).toLocaleDateString('vi-VN')}` : 'Không'}
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background || '#F8F9FA',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    marginBottom: 16,
    fontFamily: fontFamily.regular,
  },
  emptyText: {
    fontSize: 16,
    color: colors.text || '#000000',
    fontFamily: fontFamily.regular,
  },
  retryButton: {
    padding: 12,
    backgroundColor: colors.primary || '#007AFF',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: fontFamily.medium,
  },
  prescriptionCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  prescriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  prescriptionTitle: {
    fontSize: 18,
    fontFamily: fontFamily.medium,
    color: colors.text || '#000000',
  },
  prescriptionDate: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: '#8E8E93',
  },
  prescriptionDiagnosis: {
    fontSize: 16,
    fontFamily: fontFamily.medium,
    color: colors.text || '#000000',
    marginBottom: 4,
  },
  prescriptionNote: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: colors.text || '#000000',
    marginBottom: 4,
  },
  prescriptionStatus: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: '#8E8E93',
  },
})

export default MedicationScheduleScreen