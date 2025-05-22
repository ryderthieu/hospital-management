import { ImageSourcePropType } from 'react-native';

interface NewsItem {
  id: string | number;
  title: string;
  content: string;
  date: string;
  image: ImageSourcePropType;
}

// Định nghĩa SearchStackParamList cho SearchStack
export type SearchStackParamList = {
  SearchHome: undefined;
  MedicineSearch: undefined;
  DiseaseSearch: undefined;
  MedicineList: { category: string };
  MedicineDetail: { medicine: Medicine };
  DiseaseList: { category: string };
  DiseaseDetail: { disease: Disease };
};

// Định nghĩa HomeStackParamList cho HomeStack
export type HomeStackParamList = {
  Home: undefined;
  BookAppointment: undefined;
  Notifications: undefined;
  News: undefined;
  NewsDetail: { newsItem: NewsItem };
};

// Định nghĩa AppointmentStackParamList
export type AppointmentStackParamList = {
  Appointments: undefined;
  AppointmentDetail: { appointmentId: string };
  CompletedAppointmentDetail: { appointmentId: string };
};

// Định nghĩa BookAppointmentStackParamList
export type BookAppointmentStackParamList = {
  Search: undefined;
  DoctorList: undefined;
  Filter: undefined;
  BookAppointment: { doctorId: string };
};

// Định nghĩa ProfileStackParamList
export type ProfileStackParamList = {
  ProfileMain: undefined;
  AccountInfo: undefined;
  InsuranceList: undefined;
  HealthProfile: undefined;
  Settings: undefined;
  Notifications: undefined;
};

// Định nghĩa MainTabParamList
export type MainTabParamList = {
  HomeTab: undefined;
  Search: undefined; // Đây là SearchStackNavigator
  Appointment: undefined;
  Prescription: undefined;
  Profile: undefined;
  Notifications: undefined;
};

// Định nghĩa RootParamList
export type RootParamList = {
  Main: undefined;
  Auth: undefined;
  Notifications: undefined;
};

// Định nghĩa AppParamList
export type AppParamList = {
  Main: undefined;
  Auth: undefined;
};

// Định nghĩa AuthParamList
export type AuthParamList = {
  Onboarding1: undefined;
  Onboarding2: undefined;
  Onboarding3: undefined;
  Onboarding4: undefined;
  Onboarding5: undefined;
  Login: undefined;
  Signup1: undefined;
  Signup2: undefined;
  Signup3: undefined;
  Signup4: undefined;
  Forgot1: undefined;
  Forgot2: undefined;
  Forgot3: undefined;
  Forgot4: undefined;
  Forgot5: undefined;
  Forgot6: undefined;
  Forgot7: undefined;
};