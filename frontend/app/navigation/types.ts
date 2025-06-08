import { ImageSourcePropType } from 'react-native';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

interface NewsItem {
  id: string | number;
  title: string;
  content: string;
  date: string;
  image: ImageSourcePropType;
}

interface EmergencyContactDto {
  fullName: string;
  phoneNumber: string;
  relationship: string;
}

interface PatientDto {
  userId: number;
  patientId: number;
  identityNumber: string;
  insuranceNumber: string;
  fullName: string;
  birthday: string;
  gender?: string;
  address?: string;
  allergies?: string;
  height?: number;
  weight?: number;
  bloodType?: string;
  createdAt?: string;
  emergencyContactDtos?: EmergencyContactDto[];
}

interface DoctorDto {
  userId: number;
  doctorId: number;
  identityNumber: string;
  fullName: string;
  birthday: string;
  gender: string;
  address?: string;
  academicDegree: string;
  specialization: string;
  type: string;
  departmentId?: number;
  createdAt?: string;
}

interface Insurance {
  // Giả định cấu trúc, cần xác nhận từ BE hoặc FE
  insuranceId: number;
  insuranceNumber: string;
  provider: string;
  validFrom: string;
  validTo: string;
}

interface Medicine {
  // Giả định cấu trúc
  id: string;
  name: string;
  description: string;
}

interface Disease {
  // Giả định cấu trúc
  id: string;
  name: string;
  description: string;
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
  SymptomSelection: {
    doctorId: string;
    selectedDate: string;
    selectedTime: string;
    hasInsurance: boolean;
  };
  BookingConfirmation: {
    doctorId: string;
    selectedDate: string;
    selectedTime: string;
    hasInsurance: boolean;
    selectedSymptoms: string[];
  };
  Payment: {
    doctorId: string;
    selectedDate: string;
    selectedTime: string;
    hasInsurance: boolean;
    selectedSymptoms: string[];
  };
  PaymentSuccess: {
    doctorId: string;
    selectedDate: string;
    selectedTime: string;
    transactionId: string;
    appointmentId?: string;
    selectedSymptoms: string[];
  };
};

// Định nghĩa MedicationScheduleStackParamList
export type MedicationScheduleStackParamList = {
  MedicationScheduleHome: undefined;
  PrescriptionManagement: { prescriptionId: string };
  PrescriptionDetail: { prescriptionId: string };
};

// Profile stack param list
export type ProfileStackParamList = {
  ProfileMain: undefined;
  AccountInfo: undefined;
  EditAccountInfo: { user: PatientDto | DoctorDto; role: 'PATIENT' | 'DOCTOR' };
  InsuranceList: undefined;
  InsuranceDetail: { insurance: Insurance };
  EditInsurance: { insurance: Insurance };
  AddInsurance: undefined;
  HealthProfile: undefined;
  Settings: undefined;
  Notifications: undefined;
};

// Navigation prop types
export type ProfileScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'ProfileMain'>;
export type AccountInfoScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'AccountInfo'>;
export type EditAccountInfoScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'EditAccountInfo'>;
export type InsuranceListScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'InsuranceList'>;
export type InsuranceDetailScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'InsuranceDetail'>;
export type EditInsuranceScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'EditInsurance'>;
export type SettingsScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'Settings'>;

// Route prop types
export type AccountInfoScreenRouteProp = RouteProp<ProfileStackParamList, 'AccountInfo'>;
export type EditAccountInfoScreenRouteProp = RouteProp<ProfileStackParamList, 'EditAccountInfo'>;
export type InsuranceDetailScreenRouteProp = RouteProp<ProfileStackParamList, 'InsuranceDetail'>;
export type EditInsuranceScreenRouteProp = RouteProp<ProfileStackParamList, 'EditInsurance'>;

// Định nghĩa MainTabParamList
export type MainTabParamList = {
  HomeTab: undefined;
  Search: undefined; // Đây là SearchStackNavigator
  Appointment: undefined;
  MedicationSchedule: undefined;
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