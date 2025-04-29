import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Text,
} from "react-native";
import Button from "../../../components/Button";
import { PageHeader, OtpInput, ResendTimer } from "../../../components/Auth";

export default function Forgot4({ navigation }) {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef([]);
  const email = "ltn******@gmail.com"; 

  const handleResendOtp = () => {
    // Thêm logic gửi lại OTP tại đây nếu cần (ví dụ: gọi API)
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <PageHeader
          title="Xác minh OTP"
          subtitle={
            <Text>
              Vui lòng nhập OTP mà chúng tôi đã gửi đến email{" "}
              <Text style={styles.emailText}>{email}</Text>
            </Text>
          }
          onBack={() => navigation.goBack()}
        />

        <View style={styles.formContainer}>
          <OtpInput otp={otp} setOtp={setOtp} inputRefs={inputRefs} />
          <ResendTimer initialTime={60} onResend={handleResendOtp} />
        </View>

        <Button
          title="ĐĂNG KÝ"
          onPress={() => navigation.navigate("Forgot6")}
          style={styles.continueButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 50,
  },
  continueButton: {
    marginTop: 50,
    marginBottom: 20,
  },
  emailText: {
    fontWeight: "bold",
    color: "#2B2B2B",
  },
});