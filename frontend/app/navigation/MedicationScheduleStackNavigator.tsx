import type React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MedicationScheduleScreen from "../screens/MedicationSchedule/MedicationScheduleScreen";
import PrescriptionManagementScreen from "../screens/MedicationSchedule/PrescriptionManagement/PrescriptionManagementScreen";
import PrescriptionDetailsScreen from "../screens/MedicationSchedule/PrescriptionManagement/PrescriptionDetailsScreen";
import MedicationReminderScreen from "../screens/MedicationSchedule/MedicationReminder/MedicationReminderScreen";
import type { MedicationScheduleStackParamList } from "./types";

const Stack = createStackNavigator<MedicationScheduleStackParamList>();

const MedicationScheduleStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="MedicationScheduleHome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="MedicationScheduleHome"
        component={MedicationScheduleScreen}
      />
      <Stack.Screen
        name="PrescriptionManagement"
        component={PrescriptionManagementScreen}
      />
      <Stack.Screen
        name="PrescriptionDetail"
        component={PrescriptionDetailsScreen}
      />
      <Stack.Screen
        name="MedicationReminder"
        component={MedicationReminderScreen}
      />
    </Stack.Navigator>
  );
};

export default MedicationScheduleStackNavigator;
