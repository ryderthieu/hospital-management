import type React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import ProfileScreen from "../screens/Profile/ProfileScreen"
import AccountInfoScreen from "../screens/Profile/AccountInfo/AccountInfoScreen"
import EditAccountInfoScreen from "../screens/Profile/AccountInfo/EditAccountInfoScreen"
import InsuranceListScreen from "../screens/Profile/InsuranceList/InsuranceListScreen"
import InsuranceDetailScreen from "../screens/Profile/InsuranceList/InsuranceDetailScreen"
import EditInsuranceScreen from "../screens/Profile/InsuranceList/EditInsuranceScreen"
import AddInsuranceScreen from "../screens/Profile/InsuranceList/AddInsuranceScreen"
import HealthProfileScreen from "../screens/Profile/HealthProfile/HealthProfileScreen"
import EditHealthProfileScreen from "../screens/Profile/HealthProfile/EditHealthProfileScreen"
import SettingsScreen from "../screens/Profile/Settings/SettingsScreen"
import type { ProfileStackParamList } from "./types"

const Stack = createStackNavigator<ProfileStackParamList>()

const ProfileStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="ProfileMain"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="AccountInfo" component={AccountInfoScreen} />
      <Stack.Screen name="EditAccountInfo" component={EditAccountInfoScreen} />
      <Stack.Screen name="InsuranceList" component={InsuranceListScreen} />
      <Stack.Screen name="InsuranceDetail" component={InsuranceDetailScreen} />
      <Stack.Screen name="EditInsurance" component={EditInsuranceScreen} />
      <Stack.Screen name="AddInsurance" component={AddInsuranceScreen} />
      <Stack.Screen name="HealthProfile" component={HealthProfileScreen} />
      <Stack.Screen name="EditHealthProfile" component={EditHealthProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      {/* <Stack.Screen name="Notifications" component={NotificationsScreen} /> */}
    </Stack.Navigator>
  )
}

export default ProfileStackNavigator
