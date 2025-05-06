import React from 'react';
import { View, StyleSheet } from 'react-native';
import Header from "../../components/Header";
import { useNavigation } from '@react-navigation/native';
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
    backgroundColor: '#f8f8f8',
  },
});

export default AppointmentScreen;
