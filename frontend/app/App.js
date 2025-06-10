import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './context/AuthContext';
import RootNavigator from './navigation/RootNavigator';
import { FontProvider, useFont } from './context/FontContext.js';
import { View, Text } from 'react-native';
import configurePushNotifications from './services/PushNotificationConfig';

function AppContent() {
  const { fontsLoaded } = useFont();

  useEffect(() => {
    configurePushNotifications();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return <RootNavigator />;
}

export default function App() {
  return (
    <FontProvider>
      <AuthProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <AppContent />
          </NavigationContainer>
        </SafeAreaProvider>
      </AuthProvider>
    </FontProvider>
  );
}