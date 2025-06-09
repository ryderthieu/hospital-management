import type { AppointmentNote } from "./appointmentNote"
import type { Schedule } from "./schedule"


export interface Appointment {
  appointmentId: number
  doctorId: number
  schedule: Schedule
  symptoms: string
  number: number
  appointmentStatus: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED"
  createdAt: string
  patientInfo: PatientInfo
  appointmentNotes: AppointmentNote | null
  slotEnd: string // Format: "HH:mm:ss"
  slotStart: string // Format: "HH:mm:ss"
}

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
  appointmentData?: Appointment
}

export interface PatientInfo {
  id: number
  patientId: number
  userId: number
  identityNumber?: string | "Chưa xác định"
  insuranceNumber?: string | "Chưa xác định"
  fullName: string
  birthday: string
  gender: "MALE" | "FEMALE"
  address?: string | "Chưa xác định"
  allergies?: string | "Chưa xác định"
  height?: number | "Chưa xác định"
  weight?: number | "Chưa xác định"
  bloodType?: string | "Chưa xác định"
}

export interface AppointmentFilters {
  status?: string
  date?: string
  scheduleId?: number
  searchTerm?: string
}

export interface AppointmentStats {
  total: number
  pending: number
  confirmed: number
  completed: number
  cancelled: number
}
