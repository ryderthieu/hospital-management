import React from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { fontFamily } from "../../../context/FontContext";
import Header from "../../../components/Header";
import { mockSettings } from "../Data";
import type { RootStackParamList, Setting } from "../type";
import { useAuth } from "../../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, "Settings">>();
  const [settings, setSettings] = useState<Setting[]>(mockSettings);
  const { setLoggedIn, setUser, setPatient } = useAuth();

  // Handle toggle change
  const handleToggle = (id: string, newValue: boolean) => {
    const updatedSettings = settings.map((setting) => (setting.id === id ? { ...setting, value: newValue } : setting));
    setSettings(updatedSettings);
    console.log(`Setting ${id} changed to ${newValue}`);
  };

  // Handle navigation action
  const handleNavigation = (route?: keyof RootStackParamList) => {
    if (route) {
      navigation.navigate(route);
    } else {
      Alert.alert("Thông báo", "Chức năng này đang được phát triển");
    }
  };

  // Handle action items like logout
  const handleAction = async (id: string) => {
    if (id === "logout") {
      Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất không?", [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Đăng xuất",
          onPress: async () => {
            try {
              // Xóa dữ liệu từ AsyncStorage
              await AsyncStorage.removeItem("token");
              await AsyncStorage.removeItem("user");
              await AsyncStorage.removeItem("patient");

              // Reset trạng thái trong AuthContext (kích hoạt RootNavigator re-render)
              setLoggedIn(false);
              setUser(null);
              setPatient(null);

              // Không cần navigation.replace, để RootNavigator xử lý
              console.log("Logout triggered, loggedIn set to false");
            } catch (error) {
              console.error("Error during logout:", error);
              Alert.alert("Lỗi", "Đăng xuất thất bại. Vui lòng thử lại.");
            }
          },
        },
      ]);
    }
  };

  // Render a setting item based on its type
  const renderSettingItem = (setting: Setting) => {
    const handlePress = () => {
      if (setting.type === "navigation") {
        handleNavigation(setting.route);
      } else if (setting.type === "action") {
        handleAction(setting.id);
      }
    };

    return (
      <TouchableOpacity key={setting.id} onPress={handlePress} activeOpacity={0.7}>
        <View style={styles.settingItem}>
          <View style={styles.settingIconContainer}>
            <Ionicons name={setting.icon as any} size={22} color="#00B5B8" />
          </View>
          <Text style={styles.settingTitle}>{setting.title}</Text>
          {setting.type === "toggle" && (
            <Switch
              value={setting.value}
              onValueChange={(newValue) => handleToggle(setting.id, newValue)}
              trackColor={{ false: "#E0E0E0", true: "#B2EBF2" }}
              thumbColor={setting.value ? "#00B5B8" : "#F5F5F5"}
              ios_backgroundColor="#E0E0E0"
            />
          )}
          {(setting.type === "navigation" || setting.type === "action") && (
            <Ionicons name="chevron-forward" size={20} color="#C5C5C7" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Group settings by category
  const accountSettings = settings.filter((setting) => ["notifications", "darkMode", "language"].includes(setting.id));
  const supportSettings = settings.filter((setting) => ["privacy", "help", "about"].includes(setting.id));
  const otherSettings = settings.filter((setting) => setting.id === "logout");

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="Cài đặt" showBack={true} onBackPress={() => navigation.goBack()} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Phiên bản ứng dụng: 1.0.0</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tài khoản</Text>
          <View style={styles.settingsContainer}>{accountSettings.map(renderSettingItem)}</View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hỗ trợ & Thông tin</Text>
          <View style={styles.settingsContainer}>{supportSettings.map(renderSettingItem)}</View>
        </View>
        <View style={styles.section}>
          <View style={[styles.settingsContainer, styles.logoutContainer]}>{otherSettings.map(renderSettingItem)}</View>
        </View>
        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  versionContainer: {
    alignItems: "center",
    marginVertical: 15,
  },
  versionText: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: "#757575",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: "#757575",
    marginBottom: 10,
  },
  settingsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  logoutContainer: {
    marginTop: 10,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#E0F7FA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  settingTitle: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: "#212121",
    flex: 1,
  },
  bottomSpace: {
    height: 30,
  },
});

export default SettingsScreen;