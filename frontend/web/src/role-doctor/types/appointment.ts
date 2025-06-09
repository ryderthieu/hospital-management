import type { AppointmentNote } from "./appointmentNote"
import type { Schedule } from "./schedule"
import { PatientInfo } from "./patient"


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
