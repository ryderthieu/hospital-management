import type { AppointmentNote } from "./appointmentNote"
import type { Schedule } from "./schedule"
import type { PatientInfo } from "./patient"

export interface Appointment {
  appointmentId: number
  patientId: number
  patientInfo: PatientInfo | null // Có thể null
  symptoms: string
  number: number
  schedule: Schedule
  appointmentStatus: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED"
  createdAt: string
  appointmentNotes?: AppointmentNote | null
  slotEnd?: string // Format: "HH:mm:ss"
  slotStart?: string // Format: "HH:mm:ss"
}

// Interface cho response phân trang
export interface PaginatedResponse<T> {
  content: T[]
  pageNo: number
  pageSize: number
  totalElements: number
  totalPages: number
  last: boolean
}

// Interface cho filters frontend
export interface AppointmentFilters {
  status?: string
  date?: string
  scheduleId?: number
  searchTerm?: string
  gender?: string
}

export interface AppointmentStats {
  total: number
  pending: number
  confirmed: number
  completed: number
  cancelled: number
}
