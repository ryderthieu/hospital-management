// type.ts
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

export interface User {
  name: string
  email: string
  avatar: string
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

export interface EmergencyContact {
  name: string
  phone: string
  relationship: string
}

export interface MenuItem {
  id: string
  title: string
  subtitle: string
  icon: string
  color: string
  route?: keyof RootStackParamList
}

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

export interface HealthProfile {
  height?: number
  weight?: number
  bloodType?: string
  allergies?: string[]
  chronicConditions?: string[]
  medications?: Medication[]
  medicalHistory?: MedicalRecord[]
}

export interface AllergyOption {
  id: string
  name: string
  selected: boolean
}

export interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  startDate: string
  endDate?: string
  isActive: boolean
}

export interface MedicalRecord {
  id: string
  title: string
  date: string
  hospital: string
  doctor: string
  description: string
  fileUrl?: string
}

export interface Setting {
  id: string
  title: string
  icon: string
  type: "toggle" | "navigation" | "action"
  value?: boolean
  route?: keyof RootStackParamList
  action?: () => void
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "appointment" | "medicine" | "result" | "system"
  date: string
  isRead: boolean
}

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

export interface FilterOption {
  id: string
  name: string
  value: string
  selected?: boolean
}

export interface Medicine {
  id: string
  name: string
  category: string
  manufacturer: string
  description: string
  sideEffects: string
  avatar: string // Sử dụng avatar thay vì image
  price?: string
}

export interface Disease {
  id: string
  name: string
  description: string
  symptoms: string
  suggestedMedicines: Medicine[]
  image?: string
}