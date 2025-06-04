import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { fontFamily } from '../../context/FontContext';

/**
 * Component for rendering individual notification items
 * 
 * @param {Object} props
 * @param {Object} props.notification - The notification data object
 * @param {Function} props.onPress - Function to call when notification is pressed
 */
const NotificationItem = ({ notification, onPress }) => {
  // Function to get icon based on notification type
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'appointment':
        return 'calendar-outline';
      case 'results':
        return 'document-text-outline';
      case 'medication':
        return 'medical-outline';
      case 'system':
        return 'settings-outline';
      case 'news':
        return 'newspaper-outline';
      default:
        return 'notifications-outline';
    }
  };

  // Function to get color based on notification type
  const getNotificationColor = (type) => {
    switch(type) {
      case 'appointment':
        return '#00B5B8';
      case 'results':
        return '#FF9500';
      case 'medication':
        return '#FF3B30';
      case 'system':
        return '#007AFF';
      case 'news':
        return '#5856D6';
      default:
        return '#8E8E93';
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.notificationItem, 
        !notification.isRead && styles.unreadNotification
      ]}
      onPress={onPress}
    >
      <View style={[
        styles.iconContainer, 
        { backgroundColor: getNotificationColor(notification.type) + '20' }
      ]}>
        <Ionicons 
          name={getNotificationIcon(notification.type)} 
          size={24} 
          color={getNotificationColor(notification.type)} 
        />
      </View>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{notification.title}</Text>
          <Text style={styles.notificationTime}>{notification.time}</Text>
        </View>
        <Text style={styles.notificationMessage}>{notification.message}</Text>
      </View>
      {!notification.isRead && <View style={styles.unreadIndicator} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  notificationItem: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
    position: "relative",
  },
  unreadNotification: {
    backgroundColor: "#F8F8F8",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  notificationTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: "#000000",
  },
  notificationTime: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: "#8E8E93",
  },
  notificationMessage: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: "#3C3C43",
    lineHeight: 20,
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#00B5B8",
    position: "absolute",
    right: 20,
    top: 20,
  }
});

export default NotificationItem;