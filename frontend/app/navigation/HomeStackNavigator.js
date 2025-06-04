import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home/HomeScreen';
import ScheduleScreen from '../screens/Home/ScheduleScreen';
import NewsScreen from '../screens/Home/News/NewsScreen';
import NewsDetailScreen from '../screens/Home/News/NewsDetailScreen';

const Stack = createNativeStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Trang chủ" component={HomeScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="Đặt lịch khám" component={ScheduleScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="Tin tức" component={NewsScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="Chi tiết" component={NewsDetailScreen} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}