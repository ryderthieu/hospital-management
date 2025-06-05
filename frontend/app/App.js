import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './context/AuthContext';
import RootNavigator from './navigation/RootNavigator';
import { FontProvider, useFont } from './context/FontContext.js';
import { View, Text } from 'react-native';

function AppContent() {
  const { fontsLoaded } = useFont();
  
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
        <NavigationContainer>
          <AppContent />
        </NavigationContainer>
      </AuthProvider>
    </FontProvider>
  );
}