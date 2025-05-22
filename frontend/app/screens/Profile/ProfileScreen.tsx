"use client"

import type React from "react"
import { View, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert, Modal } from "react-native"
import { useState } from "react"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { fontFamily } from "../../context/FontContext"
import Header from "../../components/Header"
import * as ImagePicker from "expo-image-picker"

// Import types and mock data
import type { MenuItem } from "./type"
import { mockUser, mockMenuItems } from "./Data"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from "./type"

// Define menu item component props
interface MenuItemProps {
  item: MenuItem
}

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, "Profile">>()
  const [user, setUser] = useState(mockUser)
  const [showAvatarOptions, setShowAvatarOptions] = useState(false)

  // Handle avatar change
  const handleAvatarPress = () => {
    setShowAvatarOptions(true)
  }

  // Take photo using camera
  const takePhoto = async () => {
    setShowAvatarOptions(false)

    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync()

    if (status !== "granted") {
      Alert.alert("Quyền truy cập", "Cần quyền truy cập camera để chụp ảnh")
      return
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    })

    if (!result.canceled && result.assets && result.assets.length > 0) {
      // Update user avatar
      setUser({
        ...user,
        avatar: { uri: result.assets[0].uri },
      })

      // In a real app, you would upload the image to your server here
      console.log("New avatar from camera:", result.assets[0].uri)
    }
  }

  // Select photo from gallery
  const selectFromGallery = async () => {
    setShowAvatarOptions(false)

    // Request media library permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (status !== "granted") {
      Alert.alert("Quyền truy cập", "Cần quyền truy cập thư viện ảnh để chọn ảnh")
      return
    }

    // Launch image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    })

    if (!result.canceled && result.assets && result.assets.length > 0) {
      // Update user avatar
      setUser({
        ...user,
        avatar: { uri: result.assets[0].uri },
      })

      // In a real app, you would upload the image to your server here
      console.log("New avatar from gallery:", result.assets[0].uri)
    }
  }

  const MenuItemComponent: React.FC<MenuItemProps> = ({ item }) => {
    const handlePress = (): void => {
      // Use the route property from the menu item if available
      if (item.route) {
        navigation.navigate(item.route)
      } else if (item.id === "logout") {
        // Handle logout action
        // This would typically involve clearing auth tokens, user data, etc.
        Alert.alert("Đăng xuất thành công")
        // In a real app, you would navigate to the login screen or similar
        // navigation.navigate("Login")
      }
    }

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
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header Component */}
      <Header
        title="Hồ sơ"
        showBack={false}
        showAction={true}
        actionType="notification"
        onActionPress={() => navigation.navigate("Notifications")}
      />

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <TouchableOpacity onPress={handleAvatarPress} style={styles.avatarContainer}>
          <Image source={user.avatar} style={styles.avatar} />
          <View style={styles.editAvatarButton}>
            <Ionicons name="camera" size={14} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileEmail}>{user.email}</Text>
        </View>
      </View>

      {/* Section Title */}
      <Text style={styles.sectionTitle}>Chung</Text>

      {/* Menu List */}
      <View style={styles.menuList}>
        {mockMenuItems.map((item) => (
          <MenuItemComponent key={item.id} item={item} />
        ))}
      </View>

      {/* Avatar Options Modal */}
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00B5B8",
    borderRadius: 15,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  profileInfo: {
    marginLeft: 15,
  },
  profileName: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: "#FFF",
  },
  profileEmail: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: "#E0F7FA",
    marginTop: 3,
  },
  sectionTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: "#757575",
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 10,
  },
  menuList: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    marginHorizontal: 20,
    paddingVertical: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: "#212121",
  },
  menuItemSubtitle: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: "#9E9E9E",
    marginTop: 3,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: "#212121",
    marginBottom: 20,
    textAlign: "center",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
  },
  modalOptionText: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: "#212121",
    marginLeft: 15,
  },
  cancelOption: {
    justifyContent: "center",
    marginTop: 10,
    borderBottomWidth: 0,
  },
  cancelText: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: "#F44336",
  },
})

export default ProfileScreen
