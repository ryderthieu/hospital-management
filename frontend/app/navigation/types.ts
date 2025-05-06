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
  };
  
  