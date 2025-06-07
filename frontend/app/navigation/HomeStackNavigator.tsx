import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home/HomeScreen';
import BookAppointmentNavigator from './BookAppointmentNavigator';
import ScheduleScreen from '../screens/Home/ScheduleScreen';
import NewsScreen from '../screens/Home/News/NewsScreen';
import NewsDetailScreen from '../screens/Home/News/NewsDetailScreen';
import { HomeStackParamList } from './types';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="BookAppointment" component={BookAppointmentNavigator} options={{ headerShown: false }}/>
      <Stack.Screen name="News" component={NewsScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="NewsDetail" component={NewsDetailScreen} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}