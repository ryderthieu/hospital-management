import React, { useState } from "react";
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
  FloatingLabelInputNotIcon,
  CheckboxWithLabel,
  PageHeader,
  AuthFooter,
  Dropdown,
  DatePickerField
} from "../../../components/Auth";

export default function Signup1({ navigation }) {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [province, setProvince] = useState(null);
  const [district, setDistrict] = useState(null);
  const [ward, setWard] = useState(null);
  const [address, setAddress] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleContinue = () => {
    navigation.navigate("Signup3");
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
            <FloatingLabelInputNotIcon
              value={lastName}
              onChangeText={setLastName}
              placeholder="Nhập họ"
              containerStyle={styles.halfInput}
            />
            <FloatingLabelInputNotIcon
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Nhập tên"
              containerStyle={styles.halfInput}
            />

          <FloatingLabelInputNotIcon
            value={idNumber}
            onChangeText={setIdNumber}
            placeholder="Nhập CCCD/CMND"
          />

          <Dropdown
            selectedValue={gender}
            onValueChange={setGender}
            placeholder="Giới tính"
            onSelect={setGender}
            options={["Nam", "Nữ", "Khác"]}
          />

          <DatePickerField
            date={dob}
            onSelectDate={setDob}
            placeholder="Ngày sinh"
          />

          <Dropdown
            selectedValue={province}
            onValueChange={setProvince}
            placeholder="Tỉnh/Thành phố"
            onSelect={setProvince}
            options={["Hà Nội", "TP.HCM", "Đà Nẵng"]}
          />

          <Dropdown
            selectedValue={district}
            onValueChange={setDistrict}
            placeholder="Quận/Huyện"
            onSelect={setDistrict}
            options={["Quận 1", "Quận 2", "Quận 3"]}
          />

          <Dropdown
            selectedValue={ward}
            onValueChange={setWard}
            placeholder="Xã/Phường"
            onSelect={setWard}
            options={["Phường A", "Phường B", "Phường C"]}
          />

          <FloatingLabelInputNotIcon
            value={address}
            onChangeText={setAddress}
            placeholder="Địa chỉ"
          />

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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },  
  halfInput: {
    width: "48%",
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
