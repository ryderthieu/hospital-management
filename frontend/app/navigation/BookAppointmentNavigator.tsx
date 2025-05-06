import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BookAppointmentScreen } from '../screens/BookAppointment/DoctorBookAppointmentScreen/index';
import { SpecialistSearchScreen } from '../screens/BookAppointment/SearchDoctorScreen/index';
import { FilterOptionsScreen } from '../screens/BookAppointment/FiltersScreen/index';
import { DoctorListScreen } from '../screens/BookAppointment/DoctorListingScreen';


const Stack = createNativeStackNavigator();

export default function BookAppointmentNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tìm bác sĩ, chuyên khoa" component={SpecialistSearchScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="DoctorList" component={DoctorListScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="Bộ lọc" component={FilterOptionsScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="BookAppointment" component={BookAppointmentScreen} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}