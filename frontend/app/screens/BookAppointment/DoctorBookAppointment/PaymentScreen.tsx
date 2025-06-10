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

type PaymentMethod = "credit_card" | "momo" | "zalopay" | "vnpay" | "cash"

interface PaymentOption {
  id: PaymentMethod
  name: string
  icon?: string
  logos?: string[]
  description?: string
}

const paymentMethods: PaymentOption[] = [
  {
    id: "credit_card",
    name: "Thẻ tín dụng/ghi nợ",
    logos: ["visa", "mastercard"],
    description: "Thanh toán bằng thẻ Visa, Mastercard",
  },
  {
    id: "momo",
    name: "Ví MoMo",
    icon: "momo",
    description: "Thanh toán qua ứng dụng MoMo",
  },
  {
    id: "zalopay",
    name: "ZaloPay",
    icon: "zalopay",
    description: "Thanh toán qua ứng dụng ZaloPay",
  },
  {
    id: "vnpay",
    name: "VNPay",
    icon: "vnpay",
    description: "Thanh toán qua VNPay Gateway",
  },
  {
    id: "cash",
    name: "Tiền mặt",
    icon: "cash",
    description: "Thanh toán tiền mặt tại quầy",
  },
]

const API_BASE_URL = "http://192.168.120.172:8080"

export const PaymentScreen: React.FC<PaymentScreenProps> = ({ navigation, route }) => {
  const { fontsLoaded } = useFont()
  const { patient } = useAuth() // Lấy patient từ AuthContext
  const { doctor, selectedDate, selectedTime, hasInsurance, selectedSymptoms, location, appointmentId } = route.params
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>("credit_card")
  const [agreedToTerms, setAgreedToTerms] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showWebView, setShowWebView] = useState(false)
  const [webViewUrl, setWebViewUrl] = useState("")
  const [billId, setBillId] = useState<number | null>(null)

  const totalAmount = 150000
  const insuranceDiscount = hasInsurance ? 30000 : 0
  const finalAmount = totalAmount - insuranceDiscount

  // Tạo hóa đơn khi màn hình được tải
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
          // Chuyển hướng về màn hình đăng nhập nếu token không hợp lệ
          navigation.navigate('Login')
        }
      }
    }

    if (!billId) {
      createBill()
    }
  }, [billId, appointmentId, doctor.specialty, totalAmount, insuranceDiscount, finalAmount, patient, navigation])

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method)
  }

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

      if (selectedPaymentMethod === "cash") {
        const response = await axios.post(`${API_BASE_URL}/payment/transactions/cash-payment/${billId}`, {}, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        })
        if (response.data.error === 0) {
          handlePaymentSuccess(`CASH_${Date.now()}`)
        } else {
          throw new Error(response.data.message || "Thanh toán tiền mặt thất bại")
        }
      } else {
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
    navigation.navigate("PaymentSuccess", {
      doctor,
      selectedDate,
      selectedTime,
      transactionId,
      billId,
    })
  }

  const handleWebViewNavigationStateChange = (navState: any) => {
    if (navState.url.includes(`${API_BASE_URL}/api/payment/transactions/${billId}/success`)) {
      setShowWebView(false)
      handlePaymentSuccess(`TXN_SUCCESS_${Date.now()}`)
    } else if (
      navState.url.includes(`${API_BASE_URL}/api/payment/transactions/${billId}/cancel`) ||
      navState.url.includes("payment-error")
    ) {
      setShowWebView(false)
      Alert.alert("Thanh toán bị hủy", "Giao dịch đã bị hủy hoặc thất bại.", [{ text: "OK" }])
    }
  }

  const renderPaymentMethod = (method: PaymentOption) => {
    const isSelected = selectedPaymentMethod === method.id

    return (
      <TouchableOpacity
        key={method.id}
        style={[styles.paymentMethodItem, isSelected && styles.selectedPaymentMethod]}
        onPress={() => handlePaymentMethodSelect(method.id)}
        activeOpacity={0.7}
      >
        <View style={styles.paymentMethodLeft}>
          <View style={[styles.radioButton, isSelected && styles.radioButtonSelected]}>
            {isSelected && <View style={styles.radioButtonInner} />}
          </View>
          <View style={styles.paymentMethodInfo}>
            <Text style={[styles.paymentMethodText, { fontFamily: fontFamily.medium }]}>{method.name}</Text>
            {method.description && (
              <Text style={[styles.paymentMethodDescription, { fontFamily: fontFamily.regular }]}>
                {method.description}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.paymentMethodRight}>
          {method.logos && (
            <View style={styles.logoContainer}>
              {method.logos.includes("visa") && (
                <View style={styles.visaLogo}>
                  <Text style={[styles.logoText, { fontFamily: fontFamily.bold }]}>VISA</Text>
                </View>
              )}
              {method.logos.includes("mastercard") && (
                <View style={styles.mastercardLogo}>
                  <Text style={[styles.logoText, { fontFamily: fontFamily.bold }]}>mastercard</Text>
                </View>
              )}
            </View>
          )}
          {method.icon === "momo" && (
            <View style={styles.momoLogo}>
              <Text style={[styles.momoText, { fontFamily: fontFamily.bold }]}>mo</Text>
              <Text style={[styles.momoText, { fontFamily: fontFamily.bold }]}>mo</Text>
            </View>
          )}
          {method.icon === "zalopay" && (
            <View style={styles.zaloPay}>
              <Text style={[styles.zaloText, { fontFamily: fontFamily.bold }]}>ZaloPay</Text>
            </View>
          )}
          {method.icon === "vnpay" && (
            <View style={styles.vnPay}>
              <Text style={[styles.vnPayText, { fontFamily: fontFamily.bold }]}>VNPay</Text>
            </View>
          )}
          {method.icon === "cash" && (
            <View style={styles.cashIcon}>
              <Ionicons name="cash-outline" size={24} color={colors.text} />
            </View>
          )}
        </View>
      </TouchableOpacity>
    )
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
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#00BCD4" />
              <Text style={[styles.loadingText, { fontFamily: fontFamily.medium }]}>Đang tải trang thanh toán...</Text>
            </View>
          )}
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
          <Image source={doctor.image} style={styles.doctorImage} />
          <View style={styles.doctorInfo}>
            <Text style={[styles.doctorName, { fontFamily: fontFamily.bold }]}>{doctor.name}</Text>
            <Text style={[styles.doctorSpecialty, { fontFamily: fontFamily.regular }]}>{doctor.specialty}</Text>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.paymentSection}>
          <Text style={[styles.sectionTitle, { fontFamily: fontFamily.bold }]}>Phương thức thanh toán</Text>
          {paymentMethods.map(renderPaymentMethod)}
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

        {/* Payment Summary */}
        <View style={styles.summarySection}>
          <Text style={[styles.sectionTitle, { fontFamily: fontFamily.bold }]}>Thông tin thanh toán</Text>

          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { fontFamily: fontFamily.regular }]}>Tổng tiền</Text>
            <Text style={[styles.summaryValue, { fontFamily: fontFamily.medium }]}>
              {totalAmount.toLocaleString()} VND
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { fontFamily: fontFamily.regular }]}>BHYT</Text>
            <Text style={[styles.summaryValue, { fontFamily: fontFamily.medium }]}>
              {insuranceDiscount.toLocaleString()} VND
            </Text>
          </View>

          <View style={[styles.summaryItem, styles.totalItem]}>
            <Text style={[styles.totalLabel, { fontFamily: fontFamily.bold }]}>Thanh toán</Text>
            <Text style={[styles.totalValue, { fontFamily: fontFamily.bold }]}>{finalAmount.toLocaleString()} VND</Text>
          </View>
        </View>
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
    marginRight: 16,
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
  paymentSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    color: colors.text,
    marginBottom: 20,
  },
  paymentMethodItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    marginBottom: 12,
  },
  selectedPaymentMethod: {
    borderColor: colors.primary,
    backgroundColor: "#E0F7FA",
  },
  paymentMethodLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    borderColor: colors.primary,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 2,
  },
  paymentMethodDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  paymentMethodRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    gap: 8,
  },
  visaLogo: {
    backgroundColor: "#1A1F71",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  mastercardLogo: {
    backgroundColor: "#EB001B",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  logoText: {
    color: colors.white,
    fontSize: 12,
  },
  momoLogo: {
    backgroundColor: "#D82D8B",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: "column",
    alignItems: "center",
  },
  momoText: {
    color: colors.white,
    fontSize: 12,
    lineHeight: 14,
  },
  zaloPay: {
    backgroundColor: "#0068FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  zaloText: {
    color: colors.white,
    fontSize: 12,
  },
  vnPay: {
    backgroundColor: "#1F4E79",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  vnPayText: {
    color: colors.white,
    fontSize: 12,
  },
  cashIcon: {
    padding: 8,
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