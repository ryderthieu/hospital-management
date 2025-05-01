import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Header from "../../components/Header";

const AppointmentScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {/* Header Component */}
      <Header
        title="Lịch khám"
        showBack={false}
        showAction={true}
        actionType="notification"
        onActionPress={() => navigation.navigate('Notifications')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  text: {
    fontSize: 20,
    color: "#333",
  },
});

export default AppointmentScreen;
