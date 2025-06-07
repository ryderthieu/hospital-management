"use client"

import type React from "react"
import { useState } from "react"
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
import type { RootStackParamList } from "../types"
import { globalStyles, colors } from "../../../styles/globalStyles"
import Header from "../../../components/Header"
import { useFont, fontFamily } from "../../../context/FontContext"
import { paymentService, type PaymentRequest } from "../../../services/PaymentService"

type PaymentScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "Payment">
  route: RouteProp<RootStackParamList, "Payment">
}

type PaymentMethod = "credit_card" | "momo" | "zalopay" | "vnpay"

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
]

export const PaymentScreen: React.FC<PaymentScreenProps> = ({ navigation, route }) => {
  const { fontsLoaded } = useFont()
  const { doctor, selectedDate, selectedTime, hasInsurance, selectedSymptoms } = route.params

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>("credit_card")
  const [agreedToTerms, setAgreedToTerms] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showWebView, setShowWebView] = useState(false)
  const [webViewUrl, setWebViewUrl] = useState("")

  const totalAmount = 150000
  const insuranceDiscount = hasInsurance ? 0 : 0
  const finalAmount = totalAmount - insuranceDiscount

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method)
  }

  const handleTermsToggle = () => {
    setAgreedToTerms(!agreedToTerms)
  }

  const generateOrderId = () => {
    return `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  const handleContinue = async () => {
    if (!agreedToTerms) {
      Alert.alert("Thông báo", "Vui lòng đồng ý với điều khoản dịch vụ để tiếp tục.", [{ text: "OK" }])
      return
    }

    setIsProcessing(true)

    const paymentRequest: PaymentRequest = {
      amount: finalAmount,
      currency: "VND",
      description: `Khám bệnh - ${doctor.name} - ${selectedDate} ${selectedTime}`,
      orderId: generateOrderId(),
      returnUrl: "yourapp://payment-result",
    }

    try {
      const result = await paymentService.mockPayment(selectedPaymentMethod, paymentRequest)

      setIsProcessing(false)

      if (result.success) {
        handlePaymentSuccess(result.transactionId!)
      } else {
        Alert.alert("Thanh toán thất bại", result.error || "Có lỗi xảy ra. Vui lòng thử lại.", [{ text: "OK" }])
      }
    } catch (error) {
      setIsProcessing(false)
      Alert.alert("Lỗi", "Không thể xử lý thanh toán. Vui lòng thử lại.", [{ text: "OK" }])
    }
  }

  const handlePaymentSuccess = (transactionId: string) => {
    navigation.navigate("PaymentSuccess", {
      doctor,
      selectedDate,
      selectedTime,
      transactionId,
    })
  }

  const handleWebViewNavigationStateChange = (navState: any) => {
    if (navState.url.includes("payment-success")) {
      setShowWebView(false)
      handlePaymentSuccess("TXN_SUCCESS_" + Date.now())
    } else if (navState.url.includes("payment-cancel") || navState.url.includes("payment-error")) {
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
        </View>
      </TouchableOpacity>
    )
  }

  if (!fontsLoaded) {
    return null
  }

  // Show WebView for payment processing
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
          style={[globalStyles.button, (!agreedToTerms || isProcessing) && styles.disabledButton]}
          onPress={handleContinue}
          disabled={!agreedToTerms || isProcessing}
          activeOpacity={0.8}
        >
          {isProcessing ? (
            <View style={styles.processingContainer}>
              <ActivityIndicator size="small" color={colors.white} />
              <Text style={[globalStyles.buttonText, { fontFamily: fontFamily.bold, marginLeft: 8 }]}>
                Đang xử lý...
              </Text>
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
    marginBottom: 24,
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
    paddingBottom: 34, // Safe area bottom padding
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
