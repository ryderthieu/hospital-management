import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Onboarding1({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("Onboarding2");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={["#FFFFFF", "#AFECEF", "#7EDCE2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 1.5 }}
        locations={[0, 0.7, 1]}
        style={styles.gradient}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../assets/images/logo/Logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 200,
    height: 80,
  },
});
