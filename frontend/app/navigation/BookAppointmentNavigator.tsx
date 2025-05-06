import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BookAppointmentScreen } from '../screens/BookAppointment/DoctorBookAppointmentScreen/index';
import { SpecialistSearchScreen } from '../screens/BookAppointment/SearchDoctorScreen/index';
import { FilterOptionsScreen } from '../screens/BookAppointment/FiltersScreen/index';
import { DoctorListScreen } from '../screens/BookAppointment/DoctorListingScreen';
import { BookAppointmentStackParamList } from './types';


const Stack = createNativeStackNavigator<BookAppointmentStackParamList>();

export default function BookAppointmentNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Search" component={SpecialistSearchScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="DoctorList" component={DoctorListScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="Filter" component={FilterOptionsScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="BookAppointment" component={BookAppointmentScreen} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}