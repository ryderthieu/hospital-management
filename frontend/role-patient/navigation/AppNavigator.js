import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator'; 
import MainTabNavigator from './MainTabNavigator'; 

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Nếu người dùng chưa đăng nhập, hiển thị AuthStack */}
        <Stack.Screen name="Auth" component={AuthNavigator} />
        
        {/* Sau khi đăng nhập thành công, chuyển đến MainTabNavigator */}
        <Stack.Screen name="Main" component={MainTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
