import React from "react";
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar 
} from "react-native";
import { useFont } from '../../context/FontContext';
import Header from "../../components/Header";
import NotificationsList from "./NotificationsList";

/**
 * Notifications Screen that displays all user notifications
 */
type NotificationsScreenProps = {
  navigation: {
    goBack: () => void;
  };
};

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ navigation }) => {
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
          // Reference to the markAllAsRead function in the NotificationsList component
          // This would need to be handled via a ref or state management
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
