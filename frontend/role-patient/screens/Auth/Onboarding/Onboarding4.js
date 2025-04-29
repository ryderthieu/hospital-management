import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import OnboardingFooter from "../../../components/Onboarding/OnboardingFooter";

export default function Onboarding4({ navigation }) {
  const handleNext = () => {
    navigation.navigate("Onboarding5");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.topContainer}>
        <View style={styles.gradientWrapper}>
          <LinearGradient
            colors={["#FFFFFF", "#AFECEF", "#7EDCE2"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cornerGradient}
          />
        </View>

        {/* Logo section */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../assets/images/logo/Logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Main content */}
        <View style={styles.contentContainer}>
          <View style={styles.illustrationContainer}>
            <Image
              source={require("../../../assets/images/Onboarding/patient_record.png")}
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>

      <OnboardingFooter
        title="Trợ lý AI dành cho bạn"
        subtitle="Chatbot AI Sức khỏe ngay trong tầm tay bạn. Nhanh tay trải nghiệm ngay"
        currentPage={2}
        totalPages={3}
        onNext={handleNext}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  topContainer: {
    flex: 2,
    position: "relative",
  },
  gradientWrapper: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  cornerGradient: {
    position: "absolute",
    top: -150,
    right: -150,
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.5,
  },
  logoContainer: {
    paddingTop: 40,
    alignItems: "center",
    zIndex: 1,
  },
  logo: {
    width: 120,
    height: 50,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  illustrationContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  illustration: {
    width: "100%",
    height: 500,
    bottom: -150,
  },
  bottomSection: {
    flex: 1,
    backgroundColor: "#00B5B8",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingHorizontal: 30,
    paddingTop: 30,
    paddingBottom: 20,
    position: "relative",
    marginTop: 70,
  },
  textContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    lineHeight: 24,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginVertical: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    marginRight: 8,
  },
  activeDot: {
    width: 24,
    backgroundColor: "#FFFFFF",
  },
  navigationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },

  nextButton: {
    width: 56,
    height: 56,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  arrowContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  arrowIcon: {
    fontSize: 22,
    color: "#00B5B8",
  },
  progressBarContainer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  progressBar: {
    width: "40%",
    height: 4,
    backgroundColor: "#FFFFFF",
    borderRadius: 2,
  },
});
