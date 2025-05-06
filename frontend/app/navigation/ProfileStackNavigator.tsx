import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import AccountInfoScreen from '../screens/Profile/AccountInfo/AccountInfoScreen';
import InsuranceListScreen from '../screens/Profile/InsuranceList/InsuranceListScreen';
import HealthProfileScreen from '../screens/Profile/HealthProfile/HealthProfileScreen';
import SettingsScreen from '../screens/Profile/Settings/SettingsScreen';

const Stack = createStackNavigator();

const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="ProfileMain"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="AccountInfo" component={AccountInfoScreen} />
      <Stack.Screen name="InsuranceList" component={InsuranceListScreen} />
      <Stack.Screen name="HealthProfile" component={HealthProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;