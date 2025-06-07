import React, { useState, useEffect } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useFont, fontFamily } from "../../context/FontContext";

type ResendTimerProps = {
  initialTime?: number;
  onResend: () => void;
};


const ResendTimer = ({ initialTime = 60, onResend }: ResendTimerProps) => {
  const { fontsLoaded } = useFont();
  const [timer, setTimer] = useState(initialTime);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleResend = () => {
    if (canResend) {
      setTimer(initialTime);
      setCanResend(false);
      onResend();
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <TouchableOpacity onPress={handleResend} disabled={!canResend}>
      <Text style={[styles.resendText, canResend && styles.resendTextActive]}>
        {canResend ? "Gửi lại OTP" : `Gửi lại OTP trong ${formatTime(timer)}`}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  resendText: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },
  resendTextActive: {
    color: "#00B5B8",
    textDecorationLine: "underline",
  },
});

export { ResendTimer };