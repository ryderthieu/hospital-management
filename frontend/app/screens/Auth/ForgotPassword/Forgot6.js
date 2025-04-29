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
  PageHeader,
} from "../../../components/Auth";

export default function Forgot6({ navigation }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showValidation, setShowValidation] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false); // Track if password meets requirements
  const [passwordsMatch, setPasswordsMatch] = useState(true); // Track if passwords match

  useEffect(() => {
    // Show password requirements when the user starts typing
    if (password.length > 0) {
      setShowValidation(true);
    } else {
      setShowValidation(false);
    }

    // Basic password validation (extend based on PasswordRequirements logic)
    const meetsLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    const isValid = meetsLength && hasUpperCase && hasSpecialChar;
    setIsPasswordValid(isValid);

    // Check if passwords match
    if (confirmPassword.length > 0) {
      setPasswordsMatch(password === confirmPassword);
    } else {
      setPasswordsMatch(true); // Reset if confirm password is empty
    }
  }, [password, confirmPassword]);

  const handleContinue = () => {
    if (!isPasswordValid) {
      alert('Mật khẩu không đáp ứng các yêu cầu. Vui lòng kiểm tra lại!');
      return;
    }

    if (!passwordsMatch) {
      alert('Mật khẩu xác nhận không khớp. Vui lòng nhập lại!');
      return;
    }

    if (!password || !confirmPassword) {
      alert('Vui lòng nhập đầy đủ mật khẩu và xác nhận mật khẩu!');
      return;
    }

    navigation.navigate("Forgot7");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <PageHeader
          title="Mật khẩu mới"
          subtitle="Tạo mật khẩu mới an toàn và dễ nhớ"
          onBack={() => navigation.goBack()}
        />

        {/* Form fields */}
        <View style={styles.formContainer}>
          <FloatingLabelInput
            value={password}
            onChangeText={setPassword}
            placeholder="Nhập mật khẩu mới"
            iconName="lock-closed-outline"
            secureTextEntry={true}
            showPasswordToggle={true}
          />

          <FloatingLabelInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Xác nhận mật khẩu mới"
            iconName="lock-closed-outline"
            secureTextEntry={true}
            showPasswordToggle={true}
          />

          {confirmPassword.length > 0 && !passwordsMatch && (
            <Text style={styles.errorText}>Mật khẩu xác nhận không khớp</Text>
          )}

          <PasswordRequirements password={password} show={showValidation} />
        </View>

        {/* Continue button */}
        <Button
          title="TIẾP THEO"
          onPress={handleContinue}
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
  },
  continueButton: {
    marginTop: 30,
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
    marginBottom: 10,
  },
});