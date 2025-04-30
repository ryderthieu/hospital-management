import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Text,
} from "react-native";
import Button from "../../../components/Button";
import { 
  FloatingLabelInput,
  PasswordRequirements,
  CheckboxWithLabel,
  PageHeader,
  AuthFooter
} from "../../../components/Auth";

export default function Signup1({ navigation }) {
  const [username, setUsername] = useState("");
  const [phoneEmail, setPhoneEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    if (password.length > 0) {
      setShowValidation(true);
    } else {
      setShowValidation(false);
    }
  }, [password]);

  const handleContinue = () => {
    navigation.navigate("Signup2");
  };

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <PageHeader
          title="Đăng ký"
          subtitle="Tạo tài khoản và trải nghiệm dịch vụ"
          onBack={() => navigation.goBack()}
        />

        <View style={styles.formContainer}>
          <FloatingLabelInput
            value={username}
            onChangeText={setUsername}
            placeholder="Nhập username"
            iconName="person-outline"
          />

          <FloatingLabelInput
            value={phoneEmail}
            onChangeText={setPhoneEmail}
            placeholder="Nhập số điện thoại"
            iconName="phone-portrait-outline"
            keyboardType="email-address"
          />

          <FloatingLabelInput
            value={password}
            onChangeText={setPassword}
            placeholder="Nhập mật khẩu"
            iconName="lock-closed-outline"
            secureTextEntry={true}
            showPasswordToggle={true}
          />

          <PasswordRequirements password={password} show={showValidation} />

          <CheckboxWithLabel
            checked={termsAccepted}
            onToggle={() => setTermsAccepted(!termsAccepted)}
          >
            Tôi đồng ý với{" "}
            <Text style={styles.linkText}>Điều khoản Dịch vụ</Text> và{" "}
            <Text style={styles.linkText}>Chính sách Bảo mật</Text> của ứng dụng.
          </CheckboxWithLabel>
        </View>

        <Button
          title="TIẾP THEO"
          onPress={handleContinue}
          style={styles.continueButton}
        />

        <AuthFooter
          question="Đã có tài khoản?"
          actionText="Đăng nhập"
          onPress={handleLogin}
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
  },
  linkText: {
    color: "#00B5B8",
    fontWeight: "500",
  },
  continueButton: {
    marginTop: 30,
    marginBottom: 20,
  },
});