import React from "react";
import { View, Text, StyleSheet, Image, SafeAreaView, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Button from "../../../components/Button";

export default function Onboarding({ navigation }) {
  const handleStart = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };  

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Background gradient */}
      <LinearGradient
        colors={["#E8F9FC", "#D1F3F7", "#FFFFFF"]}
        style={styles.backgroundGradient}
      />

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../../assets/images/logo/Logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Slogan text */}
      <View style={styles.textSection}>
        <Text style={styles.title}>Chăm sóc tận tình</Text>
        <Text style={styles.title}>Bệnh tình tan biến</Text>
      </View>

      <Button title="BẮT ĐẦU NGAY" onPress={handleStart} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backgroundGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: -1,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 250,
  },
  logo: {
    width: 250,
    height: 100,
  },
  textSection: {
    alignItems: "center",
    marginTop: 180,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2B2B2B",
    lineHeight: 36,
  },
  button: {
    width: "100%",
    backgroundColor: "#00B5B8",
    paddingVertical: 16,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 40,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginText: {
    color: "#8A8A8A",
    fontSize: 16,
  },
  loginLink: {
    color: "#00B5B8",
    fontWeight: "600",
    fontSize: 16,
  },
});
