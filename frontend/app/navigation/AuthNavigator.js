import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Onboarding1 from '../screens/Auth/Onboarding/Onboarding1';
import Onboarding2 from '../screens/Auth/Onboarding/Onboarding2';
import Onboarding3 from '../screens/Auth/Onboarding/Onboarding3';
import Onboarding4 from '../screens/Auth/Onboarding/Onboarding4';
import Onboarding5 from '../screens/Auth/Onboarding/Onboarding5';
import LoginScreen from '../screens/Auth/Login/LoginScreen';
import Signup1 from '../screens/Auth/SignUp/Signup1';
import Signup2 from '../screens/Auth/SignUp/Signup2';
import Signup3 from '../screens/Auth/SignUp/Signup3';
import Signup4 from '../screens/Auth/SignUp/Signup4';
import Forgot1 from '../screens/Auth/ForgotPassword/Forgot1';
import Forgot2 from '../screens/Auth/ForgotPassword/Forgot2';
import Forgot3 from '../screens/Auth/ForgotPassword/Forgot3';
import Forgot4 from '../screens/Auth/ForgotPassword/Forgot4';
import Forgot5 from '../screens/Auth/ForgotPassword/Forgot5';
import Forgot6 from '../screens/Auth/ForgotPassword/Forgot6';
import Forgot7 from '../screens/Auth/ForgotPassword/Forgot7';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName="Onboarding1">
      {/* Onboarding */}
      <Stack.Screen name="Onboarding1" component={Onboarding1} options={{ headerShown: false }} />
      <Stack.Screen name="Onboarding2" component={Onboarding2} options={{ headerShown: false }} />
      <Stack.Screen name="Onboarding3" component={Onboarding3} options={{ headerShown: false }} />
      <Stack.Screen name="Onboarding4" component={Onboarding4} options={{ headerShown: false }} />
      <Stack.Screen name="Onboarding5" component={Onboarding5} options={{ headerShown: false }} />
      
      {/* Login */}
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>

      {/* Signup */}
      <Stack.Screen name="Signup1" component={Signup1} options={{ headerShown: false }}/>
      <Stack.Screen name="Signup2" component={Signup2} options={{ headerShown: false }}/>
      <Stack.Screen name="Signup3" component={Signup3} options={{ headerShown: false }}/>
      <Stack.Screen name="Signup4" component={Signup4} options={{ headerShown: false }}/>

      {/* Forgot Password */}
      <Stack.Screen name="Forgot1" component={Forgot1} options={{ headerShown: false }}/>
      <Stack.Screen name="Forgot2" component={Forgot2} options={{ headerShown: false }}/>
      <Stack.Screen name="Forgot3" component={Forgot3} options={{ headerShown: false }}/>
      <Stack.Screen name="Forgot4" component={Forgot4} options={{ headerShown: false }}/>
      <Stack.Screen name="Forgot5" component={Forgot5} options={{ headerShown: false }}/>
      <Stack.Screen name="Forgot6" component={Forgot6} options={{ headerShown: false }}/>
      <Stack.Screen name="Forgot7" component={Forgot7} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}
