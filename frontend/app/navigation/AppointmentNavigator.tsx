import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppointmentDetailScreen from "../screens/Appointment/AppointmentDetailScreen";
import CompletedAppointmentDetailScreen from "../screens/Appointment/CompletedAppointmentDetailScreen";
import AppointmentScreen from "../screens/Appointment/AppointmentScreen";
import { AppointmentStackParamList } from "./types";

const Stack = createNativeStackNavigator<AppointmentStackParamList>();

export default function AppointmentNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Appointments"
        component={AppointmentScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AppointmentDetail"
        component={AppointmentDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CompletedAppointmentDetail"
        component={CompletedAppointmentDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
