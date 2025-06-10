import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const configurePushNotifications = async () => {
  try {
    // Yêu cầu quyền thông báo
    const { status } = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
      },
    });

    if (status !== 'granted') {
      console.log('Quyền thông báo chưa được cấp!');
      return;
    }

    // Cấu hình kênh thông báo cho Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('medication-reminders', {
        name: 'Medication Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    // Xử lý thông báo khi nhận được
    Notifications.addNotificationReceivedListener(notification => {
      console.log('Thông báo nhận được:', notification);
    });

    // Xử lý khi người dùng tương tác với thông báo
    Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Người dùng tương tác:', response);
      const medicationId = response.notification.request.content.data.medicationId;
      if (medicationId) {
        // Có thể điều hướng hoặc xử lý thêm dựa trên medicationId
        console.log('Medication ID:', medicationId);
      }
    });

    // Cấu hình thông báo foreground
    await Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // Lấy push token (nếu cần cho thông báo đẩy)
    if (Platform.OS !== 'web') {
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Push Token:', token);
      // Gửi token này đến server backend nếu cần gửi thông báo đẩy
    }
  } catch (error) {
    console.error('Lỗi khi cấu hình thông báo:', error);
  }
};

export default configurePushNotifications;