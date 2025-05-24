import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BookAppointmentScreen } from "../screens/BookAppointment/DoctorBookAppointment/DoctorBookAppointmentScreen";
import { SpecialistSearchScreen } from "../screens/BookAppointment/SearchDoctor/SearchDoctorScreen";
import { DoctorListScreen } from "../screens/BookAppointment/DoctorListing/DoctorListingScreen";
import { SymptomSelectionScreen } from "../screens/BookAppointment/DoctorBookAppointment/SymptomSelectionScreen";
import { BookingConfirmationScreen } from "../screens/BookAppointment/DoctorBookAppointment/BookingConfirmationScreen";
import { PaymentScreen } from "../screens/BookAppointment/DoctorBookAppointment/PaymentScreen";
import { PaymentSuccessScreen } from "../screens/BookAppointment/DoctorBookAppointment/PaymentSuccessScreen";
import { BookAppointmentStackParamList } from "./types";

const Stack = createNativeStackNavigator<BookAppointmentStackParamList>();

export default function BookAppointmentNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Search"
        component={SpecialistSearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DoctorList"
        component={DoctorListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BookAppointment"
        component={BookAppointmentScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SymptomSelection"
        component={SymptomSelectionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BookingConfirmation"
        component={BookingConfirmationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PaymentSuccess"
        component={PaymentSuccessScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
