import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  FlatList
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useFont, fontFamily } from '../../context/FontContext';
import NotificationItem from "./NotificationItem";

/**
 * Component that handles the listing and management of notifications
 */
const NotificationsList = forwardRef((props, ref) => {
  const { fontsLoaded } = useFont();
  
  // Example notification data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Nhắc lịch khám',
      message: 'Lịch khám với BSCKII. Trần Nhật Trường vào ngày mai lúc 09:00',
      time: '1 giờ trước',
      isRead: false,
      type: 'appointment'
    },
    {
      id: 2,
      title: 'Kết quả xét nghiệm',
      message: 'Kết quả xét nghiệm máu của bạn đã có. Vui lòng kiểm tra.',
      time: '3 giờ trước',
      isRead: false,
      type: 'results'
    },
    {
      id: 3,
      title: 'Nhắc uống thuốc',
      message: 'Đã đến giờ uống thuốc hạ huyết áp. Vui lòng không bỏ lỡ.',
      time: '5 giờ trước',
      isRead: true,
      type: 'medication'
    },
    {
      id: 4,
      title: 'Thông báo từ hệ thống',
      message: 'Cập nhật thông tin cá nhân để nhận được dịch vụ tốt hơn.',
      time: '1 ngày trước',
      isRead: true,
      type: 'system'
    },
    {
      id: 5,
      title: 'Tin tức sức khỏe',
      message: 'Cách phòng ngừa bệnh tim mạch hiệu quả cho mọi lứa tuổi.',
      time: '2 ngày trước',
      isRead: true,
      type: 'news'
    }
  ]);

  // Function to mark a notification as read
  const markAsRead = (id) => {
    setNotifications(
      notifications.map(notification => 
        notification.id === id 
          ? {...notification, isRead: true} 
          : notification
      )
    );
  };

  // Function to mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({...notification, isRead: true}))
    );
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    markAllAsRead,
    getUnreadCount: () => notifications.filter(item => !item.isRead).length
  }));

  // Fetch notifications from API
  useEffect(() => {
    // Here you would normally fetch notifications from an API
    // Example: fetchNotifications();
  }, []);

  // Render EmptyState when no notifications
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="notifications-off-outline" size={80} color="#BDBDBD" />
      <Text style={styles.emptyText}>Không có thông báo nào</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={({item}) => (
            <NotificationItem 
              notification={item} 
              onPress={() => markAsRead(item.id)}
            />
          )}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.notificationsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        renderEmptyState()
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notificationsList: {
    paddingVertical: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    marginTop: 20,
  }
});

export default NotificationsList;