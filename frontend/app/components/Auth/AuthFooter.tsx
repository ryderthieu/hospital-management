import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useFont, fontFamily } from '../../context/FontContext';

type AuthFooterProps = {
  question: string;
  actionText: string;
  onPress: () => void;
  showBottomIndicator?: boolean;
};


const AuthFooter = ({ question, actionText, onPress, showBottomIndicator = true } :AuthFooterProps) => {
  const { fontsLoaded } = useFont();
  
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
    fontFamily: fontFamily.medium
  },
  footerLink: {
    color: "#00B5B8",
    fontWeight: "600",
    fontSize: 16,
    fontFamily: fontFamily.medium
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