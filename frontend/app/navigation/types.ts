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
  insuranceId: number;
  insuranceNumber: string;
  provider: string;
  validFrom: string;
  validTo: string;
}

interface Medicine {
  id: string;
  name: string;
  description: string;
}

interface Disease {
  id: string;
  name: string;
  description: string;
}

// Thống nhất Specialty
export interface Specialty {
  id: number;
  name: string;
  doctorCount: number;
  icon: ImageSourcePropType;
}

export type SearchStackParamList = {
  SearchHome: undefined;
  MedicineSearch: undefined;
  DiseaseSearch: undefined;
  MedicineList: { category: string };
  MedicineDetail: { medicine: Medicine };
  DiseaseList: { category: string };
  DiseaseDetail: { disease: Disease };
};

export type HomeStackParamList = {
  Home: undefined;
  BookAppointment: { screen: keyof BookAppointmentStackParamList; params?: any } | undefined;
  Notifications: undefined;
  News: undefined;
  NewsDetail: { newsItem: NewsItem };
};

export type AppointmentStackParamList = {
  Appointments: undefined;
  AppointmentDetail: { appointmentId: string };
  CompletedAppointmentDetail: { appointmentId: string };
};

export type BookAppointmentStackParamList = {
  Search: undefined;
  DoctorList: { departmentId: number; departmentName?: string };
  Filter: undefined;
  BookAppointment: { doctor: Doctor };
  SymptomSelection: {
    doctor: Doctor;
    selectedDate: string;
    selectedTime: string;
    hasInsurance: boolean;
  };
  BookingConfirmation: {
    doctor: Doctor;
    selectedDate: string;
    selectedTime: string;
    hasInsurance: boolean;
    selectedSymptoms: string[];
  };
  Payment: {
    doctor: Doctor;
    selectedDate: string;
    selectedTime: string;
    hasInsurance: boolean;
    selectedSymptoms: string[];
  };
  PaymentSuccess: {
    doctor: Doctor;
    selectedDate: string;
    selectedTime: string;
    transactionId: string;
    appointmentId?: string;
    selectedSymptoms: string[];
  };
};

export type MedicationScheduleStackParamList = {
  MedicationScheduleHome: undefined;
  PrescriptionManagement: { prescriptionId: string };
  PrescriptionDetail: { prescriptionId: string };
};

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

export type ProfileScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'ProfileMain'>;
export type AccountInfoScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'AccountInfo'>;
export type EditAccountInfoScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'EditAccountInfo'>;
export type InsuranceListScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'InsuranceList'>;
export type InsuranceDetailScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'InsuranceDetail'>;
export type EditInsuranceScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'EditInsurance'>;
export type SettingsScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'Settings'>;

export type AccountInfoScreenRouteProp = RouteProp<ProfileStackParamList, 'AccountInfo'>;
export type EditAccountInfoScreenRouteProp = RouteProp<ProfileStackParamList, 'EditAccountInfo'>;
export type InsuranceDetailScreenRouteProp = RouteProp<ProfileStackParamList, 'InsuranceDetail'>;
export type EditInsuranceScreenRouteProp = RouteProp<ProfileStackParamList, 'EditInsurance'>;

export type MainTabParamList = {
  HomeTab: undefined;
  Search: undefined;
  Appointment: undefined;
  MedicationSchedule: undefined;
  Profile: undefined;
  Notifications: undefined;
};

export type RootParamList = {
  Main: undefined;
  Auth: undefined;
  Notifications: undefined;
};

export type AppParamList = {
  Main: undefined;
  Auth: undefined;
};

export type AuthParamList = {
  Onboarding: undefined;
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

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: ImageSourcePropType;
  rating?: number;
  price: string;
  experience?: string;
  isOnline?: boolean;
  joinDate?: string;
  room?: string;
}