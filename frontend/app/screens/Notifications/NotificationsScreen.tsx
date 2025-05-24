import React from "react";
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar 
} from "react-native";
import { useFont } from '../../context/FontContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from "@react-navigation/stack";
import Header from "../../components/Header";
import NotificationsList from "./NotificationsList";
import { MainTabParamList } from "../../navigation/types";

type HomeScreenNavigationProp = StackNavigationProp<MainTabParamList, 'Notifications'>;

const NotificationsScreen: React.FC= () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { fontsLoaded } = useFont();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Reusable Header Component */}
      <Header 
        title="Thông báo"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showAction={true}
        actionText="Đọc tất cả"
        onActionPress={() => {
        }}
      />

      {/* Notifications List Component */}
      <NotificationsList />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});

export default NotificationsScreen;
