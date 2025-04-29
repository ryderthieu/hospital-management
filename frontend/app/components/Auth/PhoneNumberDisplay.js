import React from "react";
import { Text } from "react-native";

const PhoneNumberDisplay = ({ phoneNumber }) => {
  const formattedPhoneNumber = phoneNumber.slice(0, -4) + "****"; // Ẩn 4 số cuối
  return <Text>{formattedPhoneNumber}</Text>;
};

export { PhoneNumberDisplay };