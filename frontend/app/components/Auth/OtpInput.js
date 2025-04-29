import React from "react";
import { View, TextInput, StyleSheet } from "react-native";

const OtpInput = ({ otp, setOtp, inputRefs }) => {
  const handleOtpChange = (value, index) => {
    const cleanedValue = value.replace(/[^0-9]/g, "").slice(0, 1);
    const newOtp = [...otp];
    newOtp[index] = cleanedValue;
    setOtp(newOtp);

    if (cleanedValue && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
    if (!cleanedValue && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.otpContainer}>
      {otp.map((value, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          value={value}
          onChangeText={(text) => handleOtpChange(text, index)}
          keyboardType="numeric"
          maxLength={1}
          style={[styles.otpBox, value ? styles.otpBoxFilled : null]}
          textAlign="center"
          onFocus={() => inputRefs.current[index]?.focus()}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  otpBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    fontSize: 24,
    fontWeight: "bold",
  },
  otpBoxFilled: {
    backgroundColor: "#e0f7fa",
    borderWidth: 2,
    borderColor: "#00B5B8",
  },
});

export { OtpInput };