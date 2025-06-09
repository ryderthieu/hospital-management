import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { fontFamily } from '../../context/FontContext';
import Header from '../../components/Header';
import * as ImagePicker from 'expo-image-picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, MenuItem } from '../../navigation/types';
import { mockMenuItems } from './Data';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MenuItemProps {
  item: MenuItem;
}

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Profile'>>();
  const { loggedIn, patient, setPatient } = useAuth();
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);

  const handleAvatarPress = () => {
    if (!loggedIn || !patient) {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập để thay đổi ảnh đại diện');
      return;
    }
    setShowAvatarOptions(true);
  };

  const uploadAvatar = async (uri: string) => {
    if (!patient) return;

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }

      const formData = new FormData();
      formData.append('file', {
        uri,
        type: 'image/jpeg',
        name: 'avatar.jpg',
      } as any);

      const response = await API.post(`/patients/${patient.patientId}/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedPatient = {
        ...patient,
        avatar: response.data.avatar || patient.avatar,
      };
      setPatient(updatedPatient);

      Alert.alert('Thành công', 'Cập nhật ảnh đại diện thành công');
    } catch (error: any) {
      console.error(
        '[ProfileScreen] Error uploading avatar:',
        error.message,
        error.response ? {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        } : 'No response data'
      );
      Alert.alert('Lỗi', 'Không thể cập nhật ảnh đại diện. Vui lòng thử lại sau.');
    }
  };

  const deleteAvatar = async () => {
    if (!patient) return;

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }

      const response = await API.delete(`/patients/${patient.patientId}/avatar`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedPatient = {
        ...patient,
        avatar: response.data.avatar || 'https://cdn.kona-blue.com/upload/kona-blue_com/post/images/2024/09/19/465/avatar-trang-1.jpg',
      };
      setPatient(updatedPatient);

      Alert.alert('Thành công', 'Xóa ảnh đại diện thành công');
    } catch (error: any) {
      console.error(
        '[ProfileScreen] Error deleting avatar:',
        error.message,
        error.response ? {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        } : 'No response data'
      );
      Alert.alert('Lỗi', 'Không thể xóa ảnh đại diện. Vui lòng thử lại sau.');
    }
  };

  const takePhoto = async () => {
    setShowAvatarOptions(false);

    if (!loggedIn || !patient) {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập để chụp ảnh');
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Quyền truy cập', 'Cần quyền truy cập camera để chụp ảnh');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      await uploadAvatar(result.assets[0].uri);
    }
  };

  const selectFromGallery = async () => {
    setShowAvatarOptions(false);

    if (!loggedIn || !patient) {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập để chọn ảnh');
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Quyền truy cập', 'Cần quyền truy cập thư viện ảnh để chọn ảnh');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      await uploadAvatar(result.assets[0].uri);
    }
  };

  const handleDeleteAvatar = () => {
    setShowAvatarOptions(false);
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc muốn xóa ảnh đại diện?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa', onPress: deleteAvatar },
      ]
    );
  };

  const MenuItemComponent: React.FC<MenuItemProps> = ({ item }) => {
    const handlePress = (): void => {
      if (item.route) {
        navigation.navigate(item.route);
      } else if (item.id === 'logout') {
        Alert.alert('Đăng xuất thành công');
        // TODO: Implement logout logic (clear token, reset AuthContext)
      }
    };

    return (
      <TouchableOpacity style={styles.menuItem} onPress={handlePress}>
        <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
          <Ionicons name={item.icon as any} size={20} color={item.color} />
        </View>
        <View style={styles.menuItemText}>
          <Text style={styles.menuItemTitle}>{item.title}</Text>
          <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#C5C5C7" />
      </TouchableOpacity>
    );
  };

  if (!loggedIn || !patient) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Header
          title="Hồ sơ"
          showBack={false}
          showAction={true}
          actionType="notification"
          onActionPress={() => navigation.navigate('Notifications')}
        />
        <View style={styles.profileCard}>
          <Text style={styles.profileName}>Vui lòng đăng nhập để xem hồ sơ</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header
        title="Hồ sơ"
        showBack={false}
        showAction={true}
        actionType="notification"
        onActionPress={() => navigation.navigate('Notifications')}
      />
      <View style={styles.profileCard}>
        <TouchableOpacity onPress={handleAvatarPress} style={styles.avatarContainer}>
          <Image
            source={{ uri: patient.avatar || 'https://cdn.kona-blue.com/upload/kona-blue_com/post/images/2024/09/19/465/avatar-trang-1.jpg' }}
            style={styles.avatar}
          />
          <View style={styles.editAvatarButton}>
            <Ionicons name="camera" size={14} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{patient.fullName}</Text>
          <Text style={styles.profileEmail}>{patient.email}</Text>
        </View>
      </View>
      <Text style={styles.sectionTitle}>Chung</Text>
      <View style={styles.menuList}>
        {mockMenuItems.map((item) => (
          <MenuItemComponent key={item.id} item={item} />
        ))}
      </View>
      <Modal
        visible={showAvatarOptions}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAvatarOptions(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowAvatarOptions(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thay đổi ảnh đại diện</Text>
            <TouchableOpacity style={styles.modalOption} onPress={takePhoto}>
              <Ionicons name="camera-outline" size={24} color="#00B5B8" />
              <Text style={styles.modalOptionText}>Chụp ảnh mới</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={selectFromGallery}>
              <Ionicons name="image-outline" size={24} color="#00B5B8" />
              <Text style={styles.modalOptionText}>Chọn từ thư viện</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={handleDeleteAvatar}>
              <Ionicons name="trash-outline" size={24} color="#F44336" />
              <Text style={[styles.modalOptionText, { color: '#F44336' }]}>Xóa ảnh đại diện</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalOption, styles.cancelOption]}
              onPress={() => setShowAvatarOptions(false)}
            >
              <Text style={styles.cancelText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00B5B8',
    borderRadius: 15,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    marginLeft: 15,
  },
  profileName: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: '#FFF',
  },
  profileEmail: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: '#E0F7FA',
    marginTop: 3,
  },
  sectionTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: '#757575',
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 10,
  },
  menuList: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    marginHorizontal: 20,
    paddingVertical: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: '#212121',
  },
  menuItemSubtitle: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: '#9E9E9E',
    marginTop: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: '#212121',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },
  modalOptionText: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: '#212121',
    marginLeft: 15,
  },
  cancelOption: {
    justifyContent: 'center',
    marginTop: 10,
    borderBottomWidth: 0,
  },
  cancelText: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: '#F44336',
  },
});

export default ProfileScreen;