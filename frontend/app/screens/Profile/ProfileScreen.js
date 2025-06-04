import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  SafeAreaView, 
  TouchableOpacity, 
  StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFont, fontFamily } from '../../context/FontContext';
import Header from "../../components/Header";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { fontsLoaded } = useFont();

  const user = {
    name: 'Thiện Nhi',
    email: 'ltnhi15624@gmail.com',
    avatar: require('../../assets/images/avatars/profile_pic.jpg') 
  };

  const menuItems = [
    {
      id: 'account',
      title: 'Thông tin tài khoản',
      subtitle: 'Thay đổi thông tin tài khoản của bạn',
      icon: 'person-outline',
      color: '#4285F4'
    },
    {
      id: 'insurance',
      title: 'Danh sách bảo hiểm',
      subtitle: 'Thêm thông tin bảo hiểm của bạn',
      icon: 'card-outline',
      color: '#34A853'
    },
    {
      id: 'health',
      title: 'Hồ sơ sức khỏe',
      subtitle: 'Tình hình sức khỏe của bạn',
      icon: 'fitness-outline',
      color: '#FBBC05'
    },
    {
      id: 'settings',
      title: 'Cài đặt',
      subtitle: 'Quản lý và Cài đặt',
      icon: 'settings-outline',
      color: '#4285F4'
    }
  ];

  const MenuItem = ({ item }) => {
    const handlePress = () => {
      switch(item.id) {
        case 'account':
          navigation.navigate('AccountInfo');
          break;
        case 'insurance':
          navigation.navigate('InsuranceList');
          break;
        case 'health':
          navigation.navigate('HealthProfile');
          break;
        case 'settings':
          navigation.navigate('Settings');
          break;
        default:
          break;
      }
    };
    
    return (
      <TouchableOpacity style={styles.menuItem} onPress={handlePress}>
        <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
          <Ionicons name={item.icon} size={20} color={item.color} />
        </View>
        <View style={styles.menuItemText}>
          <Text style={styles.menuItemTitle}>{item.title}</Text>
          <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#C5C5C7" />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header Component */}
      <Header
        title="Hồ sơ"
        showBack={false}
        showAction={true}
        actionType="notification"
        onActionPress={() => navigation.navigate('Notifications')}
      />
      
      {/* Profile Card */}
      <View style={styles.profileCard}>
        <Image source={user.avatar} style={styles.avatar} />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileEmail}>{user.email}</Text>
        </View>
      </View>
      
      {/* Section Title */}
      <Text style={styles.sectionTitle}>Chung</Text>
      
      {/* Menu List */}
      <View style={styles.menuList}>
        {menuItems.map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    borderRadius: 15,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#FFF',
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
});

export default ProfileScreen;