export interface PatientInfo {
  id: string
  name: string
  code: string
  avatar?: string
  email: string
  phone: string
  birthDate: string
  gender: string
  age: number
  medicalHistory: string
  height: string
  weight: string
}

export interface VitalSigns {
  systolicBloodPressure?: number
  diastolicBloodPressure?: number
  heartRate?: number
  bloodSugar?: number
  temperature?: number
  weight?: number
  height?: number
}

export interface PatientDetail {
  id: string
  name: string
  avatar?: string
  clinic: string
  doctor: string
  doctorCode: string
  appointmentTime: string
  appointmentDate: string
  appointmentDateTime: string
  diagnosis: string
  doctorNotes: string
  followUpDate?: string
  hasFollowUp: boolean
  email: string
  phone: string
  birthDate: string
  medicalHistory: string
  height: string
  weight: string
  roomNumber: string
  testingStatus: string
  medicationStatus: string
  vitalSigns?: VitalSigns
  appointmentData?: any
}

export interface MedicalHistory {
  id: string
  clinic: string
  date: string
  diagnosis: string
  doctor: string
}

export interface TestResult {
  id: string
  name: string
  expectedTime: string
  actualTime?: string
  result?: string
  status: "pending" | "completed" | "in_progress"
}
