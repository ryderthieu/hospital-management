import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStackNavigator from './HomeStackNavigator';
import SearchScreen from '../screens/Search/SearchScreen';
import AppointmentScreen from '../screens/Appointment/AppointmentScreen';
import PrescriptionScreen from '../screens/Prescription/PrescriptionScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'HomeTab': iconName = 'home-outline'; break;
            case 'Search': iconName = 'search-outline'; break;
            case 'Appointment': iconName = 'calendar-outline'; break;
            case 'Prescription': iconName = 'medkit-outline'; break;
            case 'Profile': iconName = 'person-outline'; break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStackNavigator} options={{ title: 'Trang Chủ', headerShown: false }} />
      <Tab.Screen name="Search" component={SearchScreen} options={{ title: 'Tra Cứu', headerShown: true }} />
      <Tab.Screen name="Appointment" component={AppointmentScreen} options={{ title: 'Lịch Khám', headerShown: true }} />
      <Tab.Screen name="Prescription" component={PrescriptionScreen} options={{ title: 'Đơn Thuốc', headerShown: true }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Hồ Sơ', headerShown: true }} />
    </Tab.Navigator>
  );
}
