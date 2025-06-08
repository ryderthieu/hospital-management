import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useFont, fontFamily } from '../../context/FontContext';

interface OtpInputProps {
  otp: string[];
  setOtp: React.Dispatch<React.SetStateAction<string[]>>;
  inputRefs: React.RefObject<(TextInput | null)[]>;
}

const OtpInput: React.FC<OtpInputProps> = ({ otp, setOtp, inputRefs }) => {
  const { fontsLoaded } = useFont();
  if (!fontsLoaded) return null;

  const handleOtpChange = (value: string, index: number): void => {
    const cleanedValue = value.replace(/[^0-9]/g, '').slice(0, 1);
    const newOtp = [...otp];
    newOtp[index] = cleanedValue;
    setOtp(newOtp);

    if (cleanedValue && index < 5) {
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
          ref={(ref: TextInput | null) => {
            inputRefs.current[index] = ref;
          }}
          value={value}
          onChangeText={(text: string) => handleOtpChange(text, index)}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  otpBox: {
    width: 45,
    height: 45,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    fontSize: 20,
    fontFamily: fontFamily.bold,
    color: '#2B2B2B',
  },
  otpBoxFilled: {
    backgroundColor: '#E6F7FA',
    borderWidth: 1,
    borderColor: '#00B5B8',
  },
});

export { OtpInput };