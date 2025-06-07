export interface Patient {
  id: number
  name: string
  code: string
  appointment: string
  date: string
  gender: string
  age: number
  symptom: string
  status: string
  avatar?: string
}

export interface PatientDetail {
  id: string
  name: string
  avatar: string
  clinic: string
  doctor: string
  doctorCode: string
  appointmentTime: string
  appointmentDate: string
  appointmentDateTime: string
  diagnosis: string
  doctorNotes: string
  followUpDate: string
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
}
