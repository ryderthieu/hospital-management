import { ImageSourcePropType } from 'react-native';

interface NewsItem {
  id: string | number;
  title: string;
  content: string;
  date: string;
  image: ImageSourcePropType;
}

// Định nghĩa RootStackParamList cho HomeStack
export type HomeStackParamList = {
    'Home': undefined;
    'BookAppointment': undefined;
    'Notifications': undefined;
    'News': undefined;
    'NewsDetail': { newsItem: NewsItem };
  };
  
  // Định nghĩa RootStackParamList cho ProfileStack


  export type BookAppointmentStackParamList = {
    'Search': undefined;
    'DoctorList': undefined;
    'Filter': undefined;
    'BookAppointment': { doctorId: string }; 
  };

 export type ProfileStackParamList = {
    'ProfileMain': undefined;
    'AccountInfo': undefined;
    'InsuranceList': undefined;
    'HealthProfile': undefined;
    'Settings': undefined;
    'Notifications': undefined;
  };

  export type MainTabParamList = {
    'HomeTab': undefined;
    'Search': undefined;
    'Appointment': undefined;
    'Prescription': undefined;
    'Profile': undefined;
    'Notifications': undefined;
  };

  export type RootParamList = {
    'Main': undefined;
    'Auth': undefined;
    'Notifications': undefined;
  };

  export type AppParamList = {
    'Main': undefined;
    'Auth': undefined;
  };

  export type AuthParamList = {
    'Onboarding1': undefined;
    'Onboarding2': undefined;
    'Onboarding3': undefined;
    'Onboarding4': undefined;
    'Onboarding5': undefined;

    'Login': undefined;

    'Signup1': undefined;
    'Signup2': undefined;
    'Signup3': undefined;
    'Signup4': undefined;

    'Forgot1': undefined;
    'Forgot2': undefined;
    'Forgot3': undefined;
    'Forgot4': undefined;
    'Forgot5': undefined;
    'Forgot6': undefined;
    'Forgot7': undefined;
  };
  
  
  