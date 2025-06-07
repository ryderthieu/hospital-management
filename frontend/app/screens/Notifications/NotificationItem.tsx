import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  GestureResponderEvent
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { fontFamily } from '../../context/FontContext';

type NotificationType = 'appointment' | 'results' | 'medication' | 'system' | 'news' | string;

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: NotificationType;
}

interface NotificationItemProps {
  notification: Notification;
  onPress: (event: GestureResponderEvent) => void;
}

/**
 * Component for rendering individual notification items
 */
const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onPress }) => {
  const getNotificationIcon = (type: NotificationType): keyof typeof Ionicons.glyphMap => {
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

  const getNotificationColor = (type: NotificationType): string => {
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
          <View style={styles.timeContainer}>
            <Text style={styles.notificationTime}>{notification.time}</Text>
            {!notification.isRead && <View style={styles.unreadIndicator} />}
          </View>
        </View>
        <Text style={styles.notificationMessage}>{notification.message}</Text>
      </View>
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
    flex: 1,
    marginRight: 10,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationTime: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: "#8E8E93",
    marginRight: 8,
  },
  notificationMessage: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: "#3C3C43",
    lineHeight: 20,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00B5B8",
  }
});

export default NotificationItem;