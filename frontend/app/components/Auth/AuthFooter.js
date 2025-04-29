import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const AuthFooter = ({
  question,
  actionText,
  onPress,
  showBottomIndicator = true,
}) => {
  return (
    <>
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>{question} </Text>
        <TouchableOpacity onPress={onPress}>
          <Text style={styles.footerLink}>{actionText}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  footerText: {
    color: "#8A8A8A",
    fontSize: 16,
  },
  footerLink: {
    color: "#00B5B8",
    fontWeight: "600",
    fontSize: 16,
  },
  bottomIndicator: {
    width: 120,
    height: 5,
    backgroundColor: "#000",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 10,
    marginTop: 20,
  },
});

export { AuthFooter };
