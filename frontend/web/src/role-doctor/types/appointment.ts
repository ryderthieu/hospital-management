export interface Schedule {
  scheduleId: number
  doctorId: number
  workDate: string // Format: "YYYY-MM-DD"
  startTime: string // Format: "HH:mm:ss"
  endTime: string // Format: "HH:mm:ss"
  shift: string
  roomId: number
  createdAt: string
}

export interface Appointment {
  appointmentId: number
  doctorId: number
  schedule: Schedule
  symptoms: string
  number: number
  appointmentStatus: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED"
  createdAt: string
  patientInfo: any | null
  appointmentNotes: string | null
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
  priority?: "high" | "medium" | "low"
  appointmentData?: Appointment
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
