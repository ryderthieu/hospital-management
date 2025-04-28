import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';  // Sử dụng hook useAuth thay vì import context
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { loggedIn } = useAuth();  // Sử dụng hook useAuth để lấy trạng thái đăng nhập

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {loggedIn ? (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}