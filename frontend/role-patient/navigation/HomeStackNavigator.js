import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home/HomeScreen';
import ScheduleScreen from '../screens/Home/ScheduleScreen';

const Stack = createNativeStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Trang chủ" component={HomeScreen} />
      <Stack.Screen name="Đặt lịch khám" component={ScheduleScreen} />
    </Stack.Navigator>
  );
}