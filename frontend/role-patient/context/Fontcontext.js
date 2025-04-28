import React, { createContext } from 'react';
import { useFonts } from 'expo-font';
import { ActivityIndicator, View } from 'react-native';

export const FontContext = createContext();

export const FontProvider = ({ children }) => {
  const [loaded] = useFonts({
    'Gilroy-Black': require('../assets/fonts/SVN-Gilroy-Black.otf'),
    'Gilroy-BlackItalic': require('../assets/fonts/SVN-Gilroy-Black-Italic.otf'),
    'Gilroy-Bold': require('../assets/fonts/SVN-Gilroy-Bold.otf'),
    'Gilroy-BoldItalic': require('../assets/fonts/SVN-Gilroy-Bold-Italic.otf'),
    'Gilroy-Heavy': require('../assets/fonts/SVN-Gilroy-Heavy.otf'),
    'Gilroy-HeavyItalic': require('../assets/fonts/SVN-Gilroy-Heavy-Italic.otf'),
    'Gilroy-Italic': require('../assets/fonts/SVN-Gilroy-Italic.otf'),
    'Gilroy-Light': require('../assets/fonts/SVN-Gilroy-Light.otf'),
    'Gilroy-LightItalic': require('../assets/fonts/SVN-Gilroy-Light-Italic.otf'),
    'Gilroy-Medium': require('../assets/fonts/SVN-Gilroy-Medium.otf'),
    'Gilroy-MediumItalic': require('../assets/fonts/SVN-Gilroy-Medium-Italic.otf'),
    'Gilroy-Regular': require('../assets/fonts/SVN-Gilroy-Regular.otf'),
    'Gilroy-SemiBold': require('../assets/fonts/SVN-Gilroy-SemiBold.otf'),
    'Gilroy-SemiBoldItalic': require('../assets/fonts/SVN-Gilroy-SemiBold-Italic.otf'),
    'Gilroy-Thin': require('../assets/fonts/SVN-Gilroy-Thin.otf'),
    'Gilroy-ThinItalic': require('../assets/fonts/SVN-Gilroy-Thin-Italic.otf'),
    'Gilroy-XBold': require('../assets/fonts/SVN-Gilroy-XBold.otf'),
    'Gilroy-XBoldItalic': require('../assets/fonts/SVN-Gilroy-XBold-Italic.otf'),
    'Gilroy-XLight': require('../assets/fonts/SVN-Gilroy-Xlight.otf'),
    'Gilroy-XLight-Italic': require('../assets/fonts/SVN-Gilroy-Xlight-Italic.otf'),
  });

  if (!loaded) {
    // Show loading screen until fonts are loaded
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FontContext.Provider value={{ loaded }}>
      {children}
    </FontContext.Provider>
  );
};
