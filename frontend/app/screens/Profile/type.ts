import type { ImageSourcePropType } from "react-native"

// Navigation types
export type RootStackParamList = {
  Home: undefined
  Profile: undefined
  MainTabs: undefined
  AccountInfo: undefined
  EditAccountInfo: undefined
  InsuranceList: undefined
  InsuranceDetail: { insurance: Insurance }
  EditInsurance: { insurance: Insurance }
  AddInsurance: undefined
  HealthProfile: undefined
  EditHealthProfile: undefined
  Settings: undefined
  Notifications: undefined
  AppointmentDetail: { appointment: Appointment }
  CompletedAppointmentDetail: { appointment: Appointment }
  MedicineList: { category: string }
  MedicineDetail: { medicine: Medicine }
  DiseaseList: { category: string }
  DiseaseDetail: { disease: Disease }
  SortOptions: { onSort: (option: string) => void; currentSort?: string }
  FilterOptions: { onFilter: (filters: FilterOption[]) => void; currentFilters?: FilterOption[] }
}

// User profile type
export interface User {
  name: string
  email: string
  avatar: ImageSourcePropType
  phone?: string
  dob?: string
  gender?: string
  address?: string
  patientId?: string
  nationalId?: string
  province?: string
  district?: string
  ward?: string
  fullAddress?: string
  emergencyContact?: EmergencyContact
}

// Add EmergencyContact interface
export interface EmergencyContact {
  name: string
  phone: string
  relationship: string
}

// Menu item type
export interface MenuItem {
  id: string
  title: string
  subtitle: string
  icon: string
  color: string
  route?: keyof RootStackParamList
}

// Insurance type
export interface Insurance {
  id: string
  name: string
  type: "BHYT" | "BHTN" | "OTHER"
  provider: string
  policyNumber: string
  holderName: string
  startDate?: string
  expiryDate: string
  coverageType: string
  isActive: boolean
  class?: string
  benefits?: string[]
  coverageAmount?: string
  paymentFrequency?: string
  paymentAmount?: string
  lastPaymentDate?: string
  nextPaymentDate?: string
}

// Health profile type
export interface HealthProfile {
  height?: number
  weight?: number
  bloodType?: string
  allergies?: string[]
  chronicConditions?: string[]
  medications?: Medication[]
  medicalHistory?: MedicalRecord[]
}

// Allergy option type
export interface AllergyOption {
  id: string
  name: string
  selected: boolean
}

// Medication type
export interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  startDate: string
  endDate?: string
  isActive: boolean
}

// Medical record type
export interface MedicalRecord {
  id: string
  title: string
  date: string
  hospital: string
  doctor: string
  description: string
  fileUrl?: string
}

// Settings type
export interface Setting {
  id: string
  title: string
  icon: string
  type: "toggle" | "navigation" | "action"
  value?: boolean
  route?: keyof RootStackParamList
  action?: () => void
}

// Notification type
export interface Notification {
  id: string
  title: string
  message: string
  type: "appointment" | "medicine" | "result" | "system"
  date: string
  isRead: boolean
}

// Appointment type
export interface Appointment {
  id: string
  date: string
  time: string
  doctorName: string
  specialty: string
  imageUrl: string
  status: "upcoming" | "completed"
  department?: string
  room?: string
  queueNumber?: number
  patientName?: string
  patientBirthday?: string
  patientGender?: string
  patientLocation?: string
  appointmentFee?: string
  examTime?: string
  followUpDate?: string
  diagnosis?: string[]
  doctorNotes?: string[]
  testResults?: {
    name: string
    fileUrl: string
  }[]
  codes?: {
    appointmentCode?: string
    transactionCode?: string
    patientCode?: string
  }
}

// Filter Option
export interface FilterOption {
  id: string
  name: string
  value: string
  selected?: boolean
}

// Medicine type
export interface Medicine {
  id: string
  name: string
  category: string
  expiryDate: string
  manufacturer: string
  description: string
  sideEffects: string
  image: string
  price?: string
}

// Disease type
export interface Disease {
  id: string
  name: string
  description: string
  symptoms: string
  suggestedMedicines: Medicine[]
  image?: string
}
