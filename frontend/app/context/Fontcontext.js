import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

export const fontFamily = {
  medium: 'SVN-Gilroy-Medium',
  mediumItalic: 'SVN-Gilroy-Medium-Italic',
  bold: 'SVN-Gilroy-Bold',
  boldItalic: 'SVN-Gilroy-Bold-Italic',
  regular: 'SVN-Gilroy-Regular',
  light: 'SVN-Gilroy-Light',
  lightItalic: 'SVN-Gilroy-Light-Italic',
  semiBold: 'SVN-Gilroy-SemiBold',
  semiBoldItalic: 'SVN-Gilroy-SemiBold-Italic',
  thin: 'SVN-Gilroy-Thin',
  thinItalic: 'SVN-Gilroy-Thin-Italic',
  xBold: 'SVN-Gilroy-XBold',
  xBoldItalic: 'SVN-Gilroy-XBold-Italic',
  xLight: 'SVN-Gilroy-Xlight',
  xLightItalic: 'SVN-Gilroy-Xlight-Italic',
  black: 'SVN-Gilroy-Black',
  blackItalic: 'SVN-Gilroy-Black-Italic',
  heavy: 'SVN-Gilroy-Heavy',
  heavyItalic: 'SVN-Gilroy-Heavy-Italic',
};

export const fontFiles = {
  [fontFamily.medium]: require('../assets/fonts/SVN-Gilroy-Medium.otf'),
  [fontFamily.mediumItalic]: require('../assets/fonts/SVN-Gilroy-Medium-Italic.otf'),
  [fontFamily.bold]: require('../assets/fonts/SVN-Gilroy-Bold.otf'),
  [fontFamily.boldItalic]: require('../assets/fonts/SVN-Gilroy-Bold-Italic.otf'),
  [fontFamily.regular]: require('../assets/fonts/SVN-Gilroy-Regular.otf'),
  [fontFamily.light]: require('../assets/fonts/SVN-Gilroy-Light.otf'),
  [fontFamily.lightItalic]: require('../assets/fonts/SVN-Gilroy-Light-Italic.otf'),
  [fontFamily.semiBold]: require('../assets/fonts/SVN-Gilroy-SemiBold.otf'),
  [fontFamily.semiBoldItalic]: require('../assets/fonts/SVN-Gilroy-SemiBold-Italic.otf'),
  [fontFamily.thin]: require('../assets/fonts/SVN-Gilroy-Thin.otf'),
  [fontFamily.thinItalic]: require('../assets/fonts/SVN-Gilroy-Thin-Italic.otf'),
  [fontFamily.xBold]: require('../assets/fonts/SVN-Gilroy-XBold.otf'),
  [fontFamily.xBoldItalic]: require('../assets/fonts/SVN-Gilroy-XBold-Italic.otf'),
  [fontFamily.xLight]: require('../assets/fonts/SVN-Gilroy-Xlight.otf'),
  [fontFamily.xLightItalic]: require('../assets/fonts/SVN-Gilroy-Xlight-Italic.otf'),
  [fontFamily.black]: require('../assets/fonts/SVN-Gilroy-Black.otf'),
  [fontFamily.blackItalic]: require('../assets/fonts/SVN-Gilroy-Black-Italic.otf'),
  [fontFamily.heavy]: require('../assets/fonts/SVN-Gilroy-Heavy.otf'),
  [fontFamily.heavyItalic]: require('../assets/fonts/SVN-Gilroy-Heavy-Italic.otf'),
};

const FontContext = createContext({
  fontsLoaded: false,
  fontFamily,
});

export const FontProvider = ({ children }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
    
    async function loadFonts() {
      try {
        await Font.loadAsync(fontFiles);
        setFontsLoaded(true);
      } catch (error) {
        console.error("Error loading fonts:", error);
        setFontsLoaded(true);
      }
    }
    
    loadFonts();
  }, []);
  
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  
  const value = {
    fontsLoaded,
    fontFamily
  };
  
  return (
    <FontContext.Provider value={value}>
      {children}
    </FontContext.Provider>
  );
};

export const useFont = () => useContext(FontContext);