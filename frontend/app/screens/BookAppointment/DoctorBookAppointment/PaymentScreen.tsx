"use client"

import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RouteProp } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { WebView } from "react-native-webview"
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { RootStackParamList } from "../types"
import { globalStyles, colors } from "../../../styles/globalStyles"
import Header from "../../../components/Header"
import { useFont, fontFamily } from "../../../context/FontContext"
import { useAuth } from "../../../context/AuthContext"
import axios from "axios"

type PaymentScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "Payment">
  route: RouteProp<RootStackParamList, "Payment">
}

const API_BASE_URL = "http://192.168.120.172:8080"
// const API_BASE_URL = "http://192.168.1.47:8080"

export const PaymentScreen: React.FC<PaymentScreenProps> = ({ navigation, route }) => {
  const { fontsLoaded } = useFont()
  const { patient } = useAuth()
  const { doctor, selectedDate, selectedTime, hasInsurance, selectedSymptoms, location, appointmentId } = route.params
  const [agreedToTerms, setAgreedToTerms] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showWebView, setShowWebView] = useState(false)
  const [webViewUrl, setWebViewUrl] = useState("")
  const [billId, setBillId] = useState<number | null>(null)

  // Calculate total amount from doctor's consultation fee with fallback
  const totalAmount = doctor.consultationFee && typeof doctor.consultationFee === 'number' 
    ? doctor.consultationFee 
    : 150000
  const insuranceDiscount = hasInsurance ? 30000 : 0
  const finalAmount = totalAmount - insuranceDiscount

  // Create bill when screen loads
  useEffect(() => {
    const createBill = async () => {
      try {
        const token = await AsyncStorage.getItem('token')
        if (!token) {
          throw new Error('Không tìm thấy token. Vui lòng đăng nhập lại.')
        }
        if (!patient?.patientId) {
          throw new Error('Không tìm thấy patientId. Vui lòng kiểm tra thông tin người dùng.')
        }

        console.log('Sending request to:', `${API_BASE_URL}/api/payment/bills`)
        console.log('Token:', token)
        console.log('Payload:', {
          appointmentId: appointmentId || 1,
          patientId: patient.patientId,
          totalCost: totalAmount,
          insuranceDiscount: insuranceDiscount,
          amount: finalAmount,
          status: 'UNPAID',
          billDetails: [
            {
              itemName: `Khám bệnh - ${doctor.specialty}`,
              itemType: 'CONSULTATION',
              quantity: 1,
              unitPrice: totalAmount,
              insuranceDiscount: insuranceDiscount,
            },
          ],
        })

        const response = await axios.post(`${API_BASE_URL}/api/payment/bills`, {
          appointmentId: appointmentId || 1,
          patientId: patient.patientId,
          totalCost: totalAmount,
          insuranceDiscount: insuranceDiscount,
          amount: finalAmount,
          status: 'UNPAID',
          billDetails: [
            {
              itemName: `Khám bệnh - ${doctor.specialty}`,
              itemType: 'CONSULTATION',
              quantity: 1,
              unitPrice: totalAmount,
              insuranceDiscount: insuranceDiscount,
            },
          ],
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        })

        console.log('Response:', response.data)
        if (response.data.billId) {
          setBillId(response.data.billId)
        } else {
          throw new Error('Không nhận được billId từ server')
        }
      } catch (error: any) {
        console.error('Lỗi khi tạo hóa đơn:', error.response?.data || error.message)
        Alert.alert('Lỗi', error.message || 'Không thể tạo hóa đơn. Vui lòng thử lại.')
        if (error.response?.status === 401) {
          navigation.navigate('Login')
        }
      }
    }

    if (!billId) {
      createBill()
    }
  }, [billId, appointmentId, doctor.specialty, totalAmount, insuranceDiscount, finalAmount, patient, navigation])

  const handleTermsToggle = () => {
    setAgreedToTerms(!agreedToTerms)
  }

  const handleContinue = async () => {
    if (!agreedToTerms) {
      Alert.alert("Thông báo", "Vui lòng đồng ý với điều khoản dịch vụ để tiếp tục.", [{ text: "OK" }])
      return
    }

    if (!billId) {
      Alert.alert("Lỗi", "Hóa đơn chưa được tạo. Vui lòng thử lại.")
      return
    }

    setIsProcessing(true)

    try {
      const token = await AsyncStorage.getItem('token')
      if (!token) {
        throw new Error('Không tìm thấy token. Vui lòng đăng nhập lại.')
      }

      const response = await axios.post(`${API_BASE_URL}/api/payment/transactions/create-payment/${billId}`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
      if (response.data.error === 0 && response.data.data) {
        setWebViewUrl(response.data.data)
        setShowWebView(true)
      } else {
        throw new Error(response.data.message || "Không thể tạo link thanh toán")
      }
    } catch (error: any) {
      console.error('Lỗi thanh toán:', error.response?.data || error.message)
      Alert.alert('Lỗi', error.message || 'Không thể xử lý thanh toán. Vui lòng thử lại.', [{ text: "OK" }])
      if (error.response?.status === 401) {
        navigation.navigate('Login')
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePaymentSuccess = (transactionId: string) => {
    // Navigate to PaymentSuccess screen with required params
    navigation.navigate("PaymentSuccess", {
      doctor,
      selectedDate,
      selectedTime,
      transactionId,
      selectedSymptoms: selectedSymptoms || [],
      hasInsurance: hasInsurance || false
    })
  }

  const handleWebViewNavigationStateChange = (navState: any) => {
    console.log('WebView URL:', navState.url)
    
    // Kiểm tra URL chứa thông tin thanh toán thành công
    if (navState.url.includes('success') && !navState.loading) {
      // Thêm một chút delay trước khi đóng WebView
      setTimeout(() => {
        setShowWebView(false)
        handlePaymentSuccess(`TXN_SUCCESS_${Date.now()}`)
      }, 100)
    }
  }

  if (!fontsLoaded) {
    return null
  }

  if (showWebView) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <Header title="Thanh toán" showBack={true} onBackPress={() => setShowWebView(false)} />
        <WebView
          source={{ uri: webViewUrl }}
          onNavigationStateChange={handleWebViewNavigationStateChange}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent
            console.warn('WebView error: ', nativeEvent)
          }}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent
            console.warn('WebView HTTP error: ', nativeEvent)
          }}
          injectedJavaScript={`
            (function() {
              window.addEventListener('message', function(e) {
                window.ReactNativeWebView.postMessage(e.data)
              })
              true
            })()
          `}
          onMessage={(event) => {
            console.log('WebView message received:', event.nativeEvent.data)
            try {
              const data = JSON.parse(event.nativeEvent.data)
              if (data.status === 'PAID' || data.code === '00') {
                setShowWebView(false)
                setTimeout(() => {
                  handlePaymentSuccess(data.orderCode || `TXN_SUCCESS_${Date.now()}`)
                }, 300)
              }
            } catch (error) {
              console.log('Error parsing WebView message:', error)
            }
          }}
          style={{ flex: 1 }}
        />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <Header title="Đặt lịch hẹn" showBack={true} onBackPress={() => navigation.goBack()} />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Doctor Information */}
        <View style={styles.doctorSection}>
          <Image 
            source={doctor.image || { uri: "/placeholder.svg?height=60&width=60" }} 
            style={styles.doctorImage} 
            resizeMode="cover"
          />
          <View style={styles.doctorInfo}>
            <Text style={[styles.doctorName, { fontFamily: fontFamily.bold }]}>{doctor.name}</Text>
            <Text style={[styles.doctorSpecialty, { fontFamily: fontFamily.regular }]}>{doctor.specialty}</Text>
          </View>
        </View>

        {/* Payment Summary */}
        <View style={styles.summarySection}>
          <Text style={[styles.sectionTitle, { fontFamily: fontFamily.bold }]}>Thông tin thanh toán</Text>

          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { fontFamily: fontFamily.regular }]}>Tổng tiền</Text>
            <Text style={[styles.summaryValue, { fontFamily: fontFamily.medium }]}>
              {totalAmount.toLocaleString('vi-VN')} VND
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { fontFamily: fontFamily.regular }]}>BHYT</Text>
            <Text style={[styles.summaryValue, { fontFamily: fontFamily.medium }]}>
              {insuranceDiscount.toLocaleString('vi-VN')} VND
            </Text>
          </View>

          <View style={[styles.summaryItem, styles.totalItem]}>
            <Text style={[styles.totalLabel, { fontFamily: fontFamily.bold }]}>Thanh toán</Text>
            <Text style={[styles.totalValue, { fontFamily: fontFamily.bold }]}>
              {finalAmount.toLocaleString('vi-VN')} VND
            </Text>
          </View>
        </View>

        {/* Terms and Conditions */}
        <TouchableOpacity style={styles.termsContainer} onPress={handleTermsToggle} activeOpacity={0.7}>
          <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
            {agreedToTerms && <Ionicons name="checkmark" size={16} color={colors.white} />}
          </View>
          <Text style={[styles.termsText, { fontFamily: fontFamily.regular }]}>
            Tôi đồng ý với <Text style={[styles.termsLink, { fontFamily: fontFamily.medium }]}>Điều khoản Dịch vụ</Text>{" "}
            và <Text style={[styles.termsLink, { fontFamily: fontFamily.medium }]}>Chính sách Bảo mật</Text> của bệnh
            viện
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Continue Button - Fixed at bottom */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[globalStyles.button, (!agreedToTerms || isProcessing || !billId) && styles.disabledButton]}
          onPress={handleContinue}
          disabled={!agreedToTerms || isProcessing || !billId}
          activeOpacity={0.8}
        >
          {isProcessing ? (
            <View style={styles.processingContainer}>
              <ActivityIndicator size="small" color={colors.white} />
              <Text style={[globalStyles.buttonText, { fontFamily: fontFamily.bold, marginLeft: 8 }]}>Đang xử lý...</Text>
            </View>
          ) : (
            <Text style={[globalStyles.buttonText, { fontFamily: fontFamily.bold }]}>Thanh toán</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  doctorSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 20,
  },
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.base100,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    color: colors.text,
    marginBottom: 20,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 32,
    paddingRight: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: 12,
    marginTop: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  termsText: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  termsLink: {
    color: colors.primary,
  },
  summarySection: {
    backgroundColor: colors.base50,
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: colors.text,
  },
  summaryValue: {
    fontSize: 16,
    color: colors.text,
  },
  totalItem: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    marginTop: 8,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 18,
    color: colors.text,
  },
  totalValue: {
    fontSize: 18,
    color: colors.text,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 34,
    paddingTop: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  disabledButton: {
    opacity: 0.5,
  },
  processingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text,
  },
})