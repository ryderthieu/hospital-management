import React from "react";
import { Text } from "react-native";
import { useFont, fontFamily } from "../../context/FontContext";

type PhoneNumberDisplayProps = {
  phoneNumber: string;
};


const PhoneNumberDisplay = ({ phoneNumber }: PhoneNumberDisplayProps) => {
  const { fontsLoaded } = useFont();
  const formattedPhoneNumber = phoneNumber.slice(0, -4) + "****"; // Ẩn 4 số cuối
  return <Text>{formattedPhoneNumber}</Text>;
};

export { PhoneNumberDisplay };